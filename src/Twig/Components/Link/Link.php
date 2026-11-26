<?php

/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Austral\DesignBundle\Twig\Components\Link;

use Austral\DesignBundle\Twig\Base\Action;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PostMount;
use Symfony\UX\TwigComponent\Attribute\PreMount;

#[AsTwigComponent('Austral:Link', template: '@AustralDesign/Twig/Components/Link/link.html.twig')]
class Link extends Action
{
  public string $size = 'md';

  /**
   * optionsResolver
   *
   * @param OptionsResolver $resolver
   *
   * @return OptionsResolver
   */
  public static function optionsResolver(OptionsResolver $resolver): OptionsResolver
  {
    $resolver = parent::optionsResolver($resolver);
    $resolver->setAllowedValues('htmlTag', ['a', 'span']);

    $resolver->setDefault('size', 'md')
      ->addAllowedTypes('size', ['string']);

    $resolver->setDefault('theme', 'default')
      ->setAllowedValues('theme', ['default', 'reverse'])
      ->addAllowedTypes('theme', ['string']);

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
    $data = parent::postMount($data);
    $data['role'] = 'link';

    if (array_key_exists('disabled', $data) && $data['disabled'])
    {
      $this->htmlTag = 'span';
      $this->title = null;
      if (array_key_exists('title', $data))
      {
        unset($data['title']);
      }
    }

    return $data;
  }
}
