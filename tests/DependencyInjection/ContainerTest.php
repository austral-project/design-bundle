<?php

/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Austral\DesignBundle\Tests\DependencyInjection;

use Austral\DesignBundle\DependencyInjection\AustralDesignExtension;
use Austral\DesignBundle\Twig\Extension\BuildExtension;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Config\Definition\Exception\InvalidConfigurationException;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Definition;
use Symfony\Component\Translation\IdentityTranslator;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

/**
 * The Twig components are declared explicitly (the bundle has no autoconfiguration): their tag twig.component
 * must give the same key and template as their #[AsTwigComponent] attribute, and every service must be created.
 */
final class ContainerTest extends TestCase
{
  private const string COMPONENT_NAMESPACE = 'Austral\\DesignBundle\\Twig\\Components\\';

  private const string VIEWS = __DIR__.'/../../src/Resources/views/';

  /**
   * @return iterable<string, array{class-string}>
   */
  public static function components(): iterable
  {
    foreach (self::componentClasses() as $class)
    {
      yield $class => [$class];
    }
  }

  /**
   * @param class-string $class
   */
  #[DataProvider('components')]
  public function testEveryComponentCanBeCreated(string $class): void
  {
    $container = self::loadExtension();
    foreach ($container->getDefinitions() as $id => $definition)
    {
      if (str_starts_with($id, 'Austral\\DesignBundle\\'))
      {
        $definition->setPublic(true);
      }
    }
    $container->compile();

    self::assertInstanceOf($class, $container->get($class));
  }

  /**
   * @param class-string $class
   */
  #[DataProvider('components')]
  public function testTheTagGivesTheKeyAndTheTemplateOfTheAttribute(string $class): void
  {
    $attributes = new \ReflectionClass($class)->getAttributes(AsTwigComponent::class);
    self::assertCount(1, $attributes, sprintf('%s must have the #[AsTwigComponent] attribute.', $class));
    $arguments = $attributes[0]->getArguments();

    $tags = self::loadExtension()->getDefinition($class)->getTag('twig.component');
    self::assertCount(1, $tags);
    self::assertSame($arguments[0] ?? $arguments['name'] ?? null, $tags[0]['key'] ?? null);
    self::assertSame($arguments['template'] ?? null, $tags[0]['template'] ?? null);
  }

  /**
   * @param class-string $class
   */
  #[DataProvider('components')]
  public function testTheTemplateOfEveryComponentExists(string $class): void
  {
    $template = self::loadExtension()->getDefinition($class)->getTag('twig.component')[0]['template'] ?? '';
    self::assertIsString($template);
    self::assertStringStartsWith('@AustralDesign/', $template);

    self::assertFileExists(self::VIEWS.substr($template, \strlen('@AustralDesign/')));
  }

  public function testTheServicesArePrivate(): void
  {
    foreach (self::loadExtension()->getDefinitions() as $id => $definition)
    {
      if (str_starts_with($id, 'Austral\\DesignBundle\\'))
      {
        self::assertFalse($definition->isPublic(), sprintf('The service "%s" must be private.', $id));
      }
    }
  }

  public function testThePictosOfTheBundleAreFoundByDefault(): void
  {
    $picto = self::loadExtension()->getParameter('austral_design.picto');
    self::assertIsArray($picto);
    self::assertIsArray($picto['path'] ?? null);
    self::assertSame(['svg'], $picto['formats'] ?? null);

    $folder = $picto['path'][0] ?? '';
    self::assertIsString($folder);
    self::assertDirectoryExists($folder);
    self::assertFileExists($folder.'/'.$picto['default'].'.svg');
  }

  public function testTheDefaultValuesOfTheComponentsAreDeclared(): void
  {
    $defaults = self::loadExtension()->getParameter('austral_design.component_default_value');
    self::assertIsArray($defaults);

    foreach (['image', 'button', 'spacer', 'text'] as $component)
    {
      self::assertArrayHasKey($component, $defaults);
    }
    self::assertSame(['solid', 'outline', 'soft', 'ghost', 'link'], $defaults['button']['options']['themes'] ?? null);
  }

  public function testTheBuildExtensionIsDeclared(): void
  {
    $container = self::loadExtension();
    $definition = $container->getDefinition(BuildExtension::class);

    self::assertFalse($definition->isPublic());
    self::assertTrue($definition->hasTag('twig.extension'));
    self::assertSame([['method' => 'reset']], $definition->getTag('kernel.reset'));
    self::assertFileExists((string) $container->getParameter('austral_design.build.entrypoints'));

    $definition->setPublic(true);
    $container->compile();
    self::assertInstanceOf(BuildExtension::class, $container->get(BuildExtension::class));
  }

  public function testTheBuildOfTheBundleIsUsedByDefault(): void
  {
    $entrypoints = (string) self::loadExtension()->getParameter('austral_design.build.entrypoints');

    self::assertStringEndsWith('/src/Resources/public/build/entrypoints.json', str_replace('\\', '/', $entrypoints));
  }

  public function testAProjectGivesItsOwnBuild(): void
  {
    $container = self::loadExtension([['build' => '/var/www/project/public/build/entrypoints.json']]);

    self::assertSame('/var/www/project/public/build/entrypoints.json', $container->getParameter('austral_design.build.entrypoints'));
  }

  public function testAnEmptyBuildIsRefused(): void
  {
    $this->expectException(InvalidConfigurationException::class);

    self::loadExtension([['build' => ' ']]);
  }

  public function testTheXmlNamespace(): void
  {
    self::assertSame('https://austral.dev/schema/dic/austral_design', new AustralDesignExtension()->getNamespace());
  }

  /**
   * @return list<class-string>
   */
  private static function componentClasses(): array
  {
    $classes = [];
    foreach (array_keys(self::loadExtension()->getDefinitions()) as $id)
    {
      if (str_starts_with($id, self::COMPONENT_NAMESPACE) && class_exists($id))
      {
        $classes[] = $id;
      }
    }
    sort($classes);

    return $classes;
  }

  /**
   * The services that the components need from the application (the translator) are added as minimal definitions.
   *
   * @param list<array<string, mixed>> $configs
   */
  private static function loadExtension(array $configs = []): ContainerBuilder
  {
    $container = new ContainerBuilder();
    $container->setParameter('kernel.project_dir', sys_get_temp_dir());
    $container->setDefinition('translator', new Definition(IdentityTranslator::class));
    new AustralDesignExtension()->load($configs, $container);

    return $container;
  }
}
