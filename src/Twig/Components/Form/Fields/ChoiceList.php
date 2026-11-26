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

#[AsTwigComponent('Austral:Form:Fields:ChoiceList', template: '@AustralDesign/Twig/Components/Form/Fields/choice-list.html.twig')]
final class ChoiceList
{
  public bool $required = false;
  public string $type = 'checkbox';
  /**
   * @var array<array-key, array<string, mixed>>
   */
  public array $choices = [];

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
    $resolver->setDefault('required', false)
      ->setAllowedTypes('required', ['boolean']);
    $resolver->setDefault('type', '')
      ->setAllowedTypes('type', ['string'])
      ->setAllowedValues('type', ['checkbox', 'radio']);

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

      $subResolver->setDefault('checked', false)
        ->addAllowedTypes('checked', ['boolean']);

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
