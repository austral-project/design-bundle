<?php

/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Austral\DesignBundle\Twig\Components\Text;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PostMount;
use Symfony\UX\TwigComponent\Attribute\PreMount;

#[AsTwigComponent('Austral:Text', template: '@AustralDesign/Twig/Components/Text/text.html.twig')]
final class Text
{
  public bool $wysiwyg = false;
  public bool $isHeadline = false;
  public ?string $value = null;
  public ?string $theme = 'default';
  public ?string $size = 'default';

  /**
   * @param array<string, array<string, mixed>> $componentDefaultValue
   */
  public function __construct(
    private array $componentDefaultValue,
  ) {
  }

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
    $resolver->setDefault('wysiwyg', false)
      ->addAllowedTypes('wysiwyg', ['bool']);

    $resolver->setDefault('isHeadline', false)
      ->addAllowedTypes('isHeadline', ['bool']);

    $resolver->setDefault('value', '')
      ->addAllowedTypes('value', ['null', 'string']);

    $resolver->setDefault('theme', 'default')
      ->addAllowedTypes('theme', ['null', 'string']);

    $resolver->setDefault('size', 'default')
      ->addAllowedTypes('size', ['null', 'string']);

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
    $sizeDefault = $this->componentDefaultValue['text']['size'];
    if ('default' === $this->size)
    {
      $this->size = $sizeDefault;
    }
    if ($this->value != strip_tags($this->value))
    {
      $this->wysiwyg = true;
    }

    return $data;
  }
}
