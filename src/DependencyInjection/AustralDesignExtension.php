<?php

/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Austral\DesignBundle\DependencyInjection;

use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;

/**
 * Loads the Twig components of the design system and their parameters:
 * - austral_design.component_default_value: default sizes, themes and colors of the components;
 * - austral_design.picto: folders where the Austral:Picto component looks for the SVG files (the pictos of the
 *   bundle by default), the accepted formats and the picto used without name;
 * - austral_design.build.entrypoints: entrypoints.json of the compiled build, read by austral_design_styles()
 *   and austral_design_scripts(): the option austral_design.build, else the build of the bundle.
 * The application overrides the first two as parameters.
 *
 * @author Matthieu Beurel <matthieu@austral.dev>
 */
class AustralDesignExtension extends Extension
{
  /**
   * {@inheritdoc}
   *
   * @throws \Exception
   */
  public function load(array $configs, ContainerBuilder $container): void
  {
    /** @var array{build: string|null} $config */
    $config = $this->processConfiguration(new Configuration(), $configs);

    $loader = new YamlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));
    $loader->load('services.yaml');

    $container->setParameter('austral_design.picto', [
      'path' => [\dirname(__DIR__).'/Resources/public/austral-picto'],
      'formats' => ['svg'],
      'default' => 'circle-help',
    ]);

    $container->setParameter('austral_design.build.entrypoints', $config['build'] ?? \dirname(__DIR__).'/Resources/public/build/entrypoints.json');
  }

  /**
   * @return string
   */
  public function getNamespace(): string
  {
    return 'https://austral.dev/schema/dic/austral_design';
  }
}
