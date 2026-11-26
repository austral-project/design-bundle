<?php

/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Austral\DesignBundle\Twig\Components\Button;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PostMount;
use Symfony\UX\TwigComponent\Attribute\PreMount;

#[AsTwigComponent('Austral:Buttons', template: '@AustralDesign/Twig/Components/Button/buttons.html.twig')]
final class Buttons
{
  /**
   * @var string
   */
  public string $theme = '';

  /**
   * @var string
   */
  public string $size = '';

  /**
   * @var array<array-key, array<string, mixed>>
   */
  public array $children = [];

  /**
   * optionsResolver
   *
   * @param OptionsResolver $resolver
   *
   * @return OptionsResolver
   */
  public static function optionsResolver(OptionsResolver $resolver): OptionsResolver
  {
    $resolver->setIgnoreUndefined(true);

    $resolver->setDefault('theme', '')
      ->setAllowedTypes('theme', ['string'])
      ->setAllowedValues('theme', ['', 'center', 'list', 'full', 'side']);

    $resolver->setDefault('size', '')
      ->setAllowedTypes('size', ['string'])
      ->setAllowedValues('size', ['', 'small', 'auto']);

    $resolver->setDefault('children', function (OptionsResolver $subResolver) {
      $subResolver->setPrototype(true);
      Button::optionsResolver($subResolver);
    });

    return $resolver;
  }

  /**
   * @param array<string, mixed> $data
   *
   * @return array<string, mixed>
   */
  #[PreMount]
  public function preMount(array $data): array
  {
    $resolver = new OptionsResolver();
    $resolver = self::optionsResolver($resolver);

    return $resolver->resolve($data) + $data;
  }

  /**
   * @param array<string, mixed> $data
   *
   * @return array<string, mixed>
   */
  #[PostMount]
  public function postMount(array $data): array
  {
    return $data;
  }
}
