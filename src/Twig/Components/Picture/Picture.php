<?php

/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Austral\DesignBundle\Twig\Components\Picture;

use Austral\ToolsBundle\AustralTools;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PostMount;
use Symfony\UX\TwigComponent\Attribute\PreMount;

#[AsTwigComponent('Austral:Picture', template: '@AustralDesign/Twig/Components/Picture/picture.html.twig')]
final class Picture
{
  public bool $lazyLoading = false;
  public ?string $lazyLoadingOffset = null;
  public ?string $aspectRatio = null;
  public ?string $aspectRatioParent = null;
  public ?string $scrollAnimate = null;
  public ?string $objectFit = 'cover';

  public ?string $size = 'default';

  /**
   * @var array<array-key, array<string, mixed>>
   */
  public array $sources = [];
  public ?string $original = null;
  public ?string $miniature = null;
  public ?string $alt = null;

  public string $sizeDefault;
  public string $optionDefault;

  /**
   * @param array<string, array<string, mixed>> $componentDefaultValue
   */
  public function __construct(
    array $componentDefaultValue,
    private string $publicDir,
  ) {
    $this->sizeDefault = $componentDefaultValue['image']['size'];
    $this->optionDefault = $componentDefaultValue['image']['option'];
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
    $resolver->setDefault('lazyLoading', false)
      ->addAllowedTypes('lazyLoading', ['null', 'bool']);

    $resolver->setDefault('lazyLoadingOffset', '')
      ->addAllowedTypes('lazyLoadingOffset', ['null', 'string']);

    $resolver->setDefault('objectFit', 'cover')
      ->addAllowedTypes('objectFit', ['null', 'string'])
      ->setAllowedValues('objectFit', ['default', 'cover', 'contain']);

    $resolver->setDefault('size', 'default')
      ->addAllowedTypes('size', ['null', 'string']);

    $resolver->setDefault('aspectRatio', '')
      ->addAllowedTypes('aspectRatio', ['null', 'string', 'float', 'int']);

    $resolver->setDefault('aspectRatioParent', '')
      ->addAllowedTypes('aspectRatioParent', ['null', 'string', 'float', 'int']);

    $resolver->setDefault('scrollAnimate', '')
      ->addAllowedTypes('scrollAnimate', ['null', 'string']);

    $resolver->setDefault('original', '')
      ->addAllowedTypes('original', ['null', 'string']);

    $resolver->setDefault('miniature', '')
      ->addAllowedTypes('miniature', ['null', 'string']);

    $resolver->setDefault('alt', '')
      ->addAllowedTypes('alt', ['null', 'string']);

    $resolver->setDefault('sources', function (OptionsResolver $subResolver) {
      $subResolver->setPrototype(true)
        ->setDefaults(
          [
            'media' => null,
            'srcset' => null,
          ]
        )
        ->addAllowedTypes('media', ['null', 'string'])
        ->addAllowedTypes('srcset', ['null', 'string']);
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
    if ($this->lazyLoading)
    {
      $data['data-lazy-load'] = 'image';
    }
    if ($this->lazyLoadingOffset)
    {
      $data['data-lazy-load-offset'] = $this->lazyLoadingOffset;
    }
    if ('default' === $this->size)
    {
      $this->size = $this->sizeDefault;
    }
    if ('default' === $this->objectFit)
    {
      $this->objectFit = $this->optionDefault;
    }

    if ('height_auto' === $this->size)
    {
      $filePath = AustralTools::join($this->publicDir, $this->original);
      if (file_exists($filePath))
      {
        $imageSizes = AustralTools::imageDimension($filePath, true);
        if (array_key_exists('width', $imageSizes) && array_key_exists('height', $imageSizes) && $imageSizes['width'] > 0 && $imageSizes['height'] > 0)
        {
          // Value of the CSS property aspect-ratio (width / height)
          $this->aspectRatio = $imageSizes['width'].' / '.$imageSizes['height'];
        }
      }
    }

    return $data;
  }
}
