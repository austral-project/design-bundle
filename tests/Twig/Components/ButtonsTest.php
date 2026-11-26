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

namespace Austral\DesignBundle\Tests\Twig\Components;

use Austral\DesignBundle\Twig\Components\Button\Buttons;
use PHPUnit\Framework\TestCase;

/**
 * The buttons given in "children" are mounted on the component, so the template can render them.
 */
final class ButtonsTest extends TestCase
{
  public function testTheChildrenAreAPublicProperty(): void
  {
    // symfony/ux-twig-component only mounts and exposes the public properties
    self::assertTrue(new \ReflectionProperty(Buttons::class, 'children')->isPublic());
  }

  public function testTheChildrenGetTheDefaultsOfAButton(): void
  {
    $data = new Buttons()->preMount([
      'theme' => 'list',
      'children' => [
        ['entitled' => 'Save'],
        ['entitled' => 'Cancel', 'htmlTag' => 'button'],
      ],
    ]);

    self::assertSame('list', $data['theme']);
    self::assertIsArray($data['children']);
    self::assertCount(2, $data['children']);
    self::assertSame('Save', $data['children'][0]['entitled']);
    self::assertSame('a', $data['children'][0]['htmlTag']);
    self::assertSame('solid', $data['children'][0]['theme']);
    self::assertSame('default', $data['children'][0]['size']);
    self::assertSame('button', $data['children'][1]['htmlTag']);
  }
}
