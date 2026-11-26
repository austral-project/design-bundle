<?php

/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Austral\DesignBundle\Twig\Components\Modal;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PostMount;
use Symfony\UX\TwigComponent\Attribute\PreMount;

#[AsTwigComponent('Austral:Modal', template: '@AustralDesign/Twig/Components/Modal/modal.html.twig')]
final class Modal
{
  public string $modalId = 'modal-master';
  public string $theme = 'center';
  public bool $close = true;
  public ?string $returnUrl = null;
  public ?string $classValue = null;
  public bool $hasLoader = false;

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
    $resolver->setDefault('modalId', 'modal-master')
      ->setAllowedTypes('modalId', ['string']);

    $resolver->setDefault('theme', 'center')
      ->setAllowedTypes('theme', ['string'])
      ->setAllowedValues('theme', ['center', 'left', 'right', 'full']);

    $resolver->setDefault('close', true)
      ->setAllowedTypes('close', ['boolean']);

    $resolver->setDefault('hasLoader', true)
      ->setAllowedTypes('hasLoader', ['boolean']);

    $resolver->setDefault('returnUrl', null)
      ->setAllowedTypes('returnUrl', ['null', 'string']);

    $resolver->setDefault('classValue', null)
      ->setAllowedTypes('classValue', ['null', 'string']);

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
