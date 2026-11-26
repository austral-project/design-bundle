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

namespace Austral\DesignBundle\Tests\Twig\Extension;

use Austral\DesignBundle\Twig\Extension\BuildExtension;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * austral_design_styles() and austral_design_scripts() render the files of an entry of entrypoints.json.
 */
final class BuildExtensionTest extends TestCase
{
  private const string ENTRYPOINTS = __DIR__.'/../../Fixtures/entrypoints.json';

  private const string BUILD = __DIR__.'/../../../src/Resources/public/build/entrypoints.json';

  public function testTheFunctionsAreDeclared(): void
  {
    $names = array_map(static fn ($function) => $function->getName(), new BuildExtension(self::ENTRYPOINTS)->getFunctions());

    self::assertSame(['austral_design_styles', 'austral_design_scripts'], $names);
  }

  public function testTheStylesOfAnEntry(): void
  {
    self::assertSame(
      '<link rel="stylesheet" href="/bundles/australdesign/build/shared.css">'."\n".
      '<link rel="stylesheet" href="/bundles/australdesign/build/front.css">',
      new BuildExtension(self::ENTRYPOINTS)->styles('front')
    );
  }

  public function testTheScriptsOfAnEntryAreDeferred(): void
  {
    self::assertSame(
      '<script src="/bundles/australdesign/build/runtime.js" defer></script>'."\n".
      '<script src="/bundles/australdesign/build/front.js" defer></script>',
      new BuildExtension(self::ENTRYPOINTS)->scripts('front')
    );
  }

  public function testAFileSharedByTwoEntriesIsRenderedOnce(): void
  {
    $extension = new BuildExtension(self::ENTRYPOINTS);
    $extension->styles('front');
    $extension->scripts('front');

    self::assertSame('<link rel="stylesheet" href="/bundles/australdesign/build/admin.css">', $extension->styles('admin'));
    self::assertSame('<script src="/bundles/australdesign/build/admin.js" defer></script>', $extension->scripts('admin'));
    self::assertSame('', $extension->styles('front'));
  }

  public function testResetRendersTheFilesAgain(): void
  {
    $extension = new BuildExtension(self::ENTRYPOINTS);
    $first = $extension->styles('front');
    $extension->reset();

    self::assertSame($first, $extension->styles('front'));
  }

  public function testTheUrlsArePrefixedWithTheBasePath(): void
  {
    $request = Request::create('/sub/page', 'GET', [], [], [], [
      'SCRIPT_FILENAME' => '/var/www/sub/index.php',
      'SCRIPT_NAME' => '/sub/index.php',
      'PHP_SELF' => '/sub/index.php',
    ]);
    $requestStack = new RequestStack();
    $requestStack->push($request);

    self::assertStringStartsWith(
      '<script src="/sub/bundles/australdesign/build/runtime.js" defer></script>',
      new BuildExtension(self::ENTRYPOINTS, $requestStack)->scripts('front')
    );
  }

  public function testTheAttributesAreEscapedAndFalseOrNullAreSkipped(): void
  {
    $html = new BuildExtension(self::ENTRYPOINTS)->scripts('admin', ['type' => 'module', 'nonce' => '"><x', 'defer' => false, 'async' => null]);

    self::assertStringContainsString('<script src="/bundles/australdesign/build/runtime.js" type="module" nonce="&quot;&gt;&lt;x"></script>', $html);
    self::assertStringNotContainsString('defer', $html);
    self::assertStringNotContainsString('async', $html);
  }

  public function testAnUnknownEntryIsRefused(): void
  {
    $this->expectException(\InvalidArgumentException::class);
    $this->expectExceptionMessage('The entry "unknown" is not in the build of the design system');

    new BuildExtension(self::ENTRYPOINTS)->styles('unknown');
  }

  public function testAMissingBuildIsReported(): void
  {
    $this->expectException(\RuntimeException::class);
    $this->expectExceptionMessage('The build of the design system is missing');

    new BuildExtension(__DIR__.'/missing.json')->styles();
  }

  public function testTheBuildOfTheBundleHasTheTwoEntries(): void
  {
    $extension = new BuildExtension(self::BUILD);

    foreach (['austral-design', 'austral-design-admin'] as $entry)
    {
      $extension->reset();
      self::assertStringContainsString('<link rel="stylesheet" href="/bundles/australdesign/build/', $extension->styles($entry));
      self::assertStringContainsString('<script src="/bundles/australdesign/build/', $extension->scripts($entry));
    }
  }
}
