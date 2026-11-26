<?php

/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Austral\DesignBundle\Twig\Components\Spacer;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PostMount;
use Symfony\UX\TwigComponent\Attribute\PreMount;

#[AsTwigComponent('Austral:Spacer', template: '@AustralDesign/Twig/Components/Spacer/spacer.html.twig')]
final class Spacer
{
  public string $size = 'lg';
  public string $theme = 'default';

  private string $sizeDefault;

  /**
   * @param array<string, array<string, mixed>> $componentDefaultValue
   */
  public function __construct(
    array $componentDefaultValue,
  ) {
    $this->sizeDefault = $componentDefaultValue['spacer']['size'];
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
    $resolver->setIgnoreUndefined(true);

    $resolver->setDefault('size', 'lg')
      ->setAllowedValues('size', ['default', '3xl', '2xl', 'xl', 'lg', 'md']);

    $resolver->setDefault('theme', 'transparent')
      ->setAllowedValues('theme', ['transparent', 'visible']);

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
    if ('default' === $this->size)
    {
      $this->size = $this->sizeDefault;
    }

    return $data;
  }
}
