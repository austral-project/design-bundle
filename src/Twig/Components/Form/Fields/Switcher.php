<?php

/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Austral\DesignBundle\Twig\Components\Form\Fields;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PostMount;
use Symfony\UX\TwigComponent\Attribute\PreMount;

#[AsTwigComponent('Austral:Form:Fields:Switcher', template: '@AustralDesign/Twig/Components/Form/Fields/switcher.html.twig')]
final class Switcher
{
  public string $theme = 'solid';
  public string $size = 'full';
  /**
   * @var array<array-key, array<string, mixed>>
   */
  public array $choices = [];
  public ?bool $checked = null;

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

    $resolver->setDefault('theme', null)
      ->addAllowedTypes('theme', ['null', 'string'])
      ->addAllowedValues('theme', ['solid', 'soft', 'underline']);

    $resolver->setDefault('size', 'full')
      ->addAllowedTypes('size', ['string'])
      ->addAllowedValues('size', ['full', 'compact']);

    $resolver->setDefault('choices', function (OptionsResolver $subResolver) {
      $subResolver->setPrototype(true);
      $subResolver->setIgnoreUndefined(true);

      $subResolver->setDefault('id', null)
        ->addAllowedTypes('id', ['null', 'string']);

      $subResolver->setDefault('name', null)
        ->addAllowedTypes('name', ['null', 'string']);

      $subResolver->setDefault('label', null)
        ->addAllowedTypes('label', ['null', 'string']);

      $subResolver->setDefault('disabled', false)
        ->addAllowedTypes('disabled', ['boolean']);

      $subResolver->setDefault('reverse', false)
        ->addAllowedTypes('reverse', ['boolean']);

      $subResolver->setDefault('required', false)
        ->addAllowedTypes('required', ['boolean']);

      $subResolver->setDefault('checked', null)
        ->addAllowedTypes('checked', ['null', 'boolean']);

      $subResolver->setDefault('datas', [])
        ->addAllowedTypes('datas', ['array']);

      $subResolver->setDefault('value', null);
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
