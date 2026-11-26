<?php

/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Austral\DesignBundle\Twig\Components\Title;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PostMount;
use Symfony\UX\TwigComponent\Attribute\PreMount;

#[AsTwigComponent('Austral:Title', template: '@AustralDesign/Twig/Components/Title/title.html.twig')]
final class Title
{
  public string $htmlTag = 'h2';
  public ?string $theme = '';
  public ?string $size = '';
  public ?string $before = null;
  public ?string $value = null;
  public ?string $after = null;
  public bool $center = false;

  public ?string $text = null;
  public ?string $textWysiwyg = null;

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
    $resolver->setDefault('htmlTag', 'span')
      ->setAllowedValues('htmlTag', ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span'])
      ->addAllowedTypes('htmlTag', ['string']);

    $resolver->setDefault('before', '')
      ->addAllowedTypes('before', ['null', 'string']);

    $resolver->setDefault('value', '')
      ->addAllowedTypes('value', ['null', 'string']);

    $resolver->setDefault('after', '')
      ->addAllowedTypes('after', ['null', 'string']);

    $resolver->setDefault('size', 'default')
      ->addAllowedTypes('size', ['string']);

    $resolver->setDefault('theme', 'default')
      ->addAllowedTypes('theme', ['string']);

    $resolver->setDefault('center', false)
      ->addAllowedTypes('center', ['bool']);

    $resolver->setDefault('text', '')
      ->addAllowedTypes('text', ['null', 'string']);

    $resolver->setDefault('textWysiwyg', false)
      ->addAllowedTypes('textWysiwyg', ['bool']);

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
    if ('default' == $this->size)
    {
      $this->size = str_replace('h', '', $this->htmlTag);
    }

    return $data;
  }
}
