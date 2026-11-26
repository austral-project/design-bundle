<?php

/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Austral\DesignBundle\Twig\Base;

use Symfony\Component\OptionsResolver\OptionsResolver;

abstract class Action
{
  public string $htmlTag = 'a';
  public ?string $entitled = null;
  public ?string $additional = null;
  public ?string $theme = 'default';
  public ?string $title = '';
  public bool $isInternal = true;
  public bool $isCurrent = false;

  public ?string $picto = null;
  public ?string $pictoRight = null;
  public ?string $target = null;

  /**
   * @var array<string, mixed>
   */
  public array $reloadTriggerOptions = [];

  /**
   * @var list<string>
   */
  protected array $removeEmptyDataKeys = [
    'href',
    'target',
  ];

  public function __construct()
  {
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

    $resolver->setDefault('htmlTag', 'a')
      ->addAllowedTypes('htmlTag', ['string']);

    $resolver->setDefault('entitled', null)
      ->addAllowedTypes('entitled', ['null', 'string']);

    $resolver->setDefault('title', null)
      ->addAllowedTypes('title', ['null', 'string']);

    $resolver->setDefault('disabled', false)
      ->addAllowedTypes('disabled', ['null', 'boolean']);

    $resolver->setDefault('isCurrent', false)
      ->addAllowedTypes('isCurrent', ['null', 'boolean']);

    $resolver->setDefault('isInternal', true)
      ->addAllowedTypes('isInternal', ['null', 'boolean']);

    $resolver->setDefault('href', null)
      ->addAllowedTypes('href', ['null', 'string']);

    $resolver->setDefault('theme', null)
      ->addAllowedTypes('theme', ['null', 'string']);

    $resolver->setDefault('target', null)
      ->addAllowedTypes('target', ['null', 'string']);

    $resolver->setDefault('picto', null)
      ->addAllowedTypes('picto', ['null', 'string']);

    $resolver->setDefault('pictoRight', null)
      ->addAllowedTypes('pictoRight', ['null', 'string']);

    $resolver->setDefault('reloadTriggerOptions', [])
      ->addAllowedTypes('reloadTriggerOptions', ['array']);

    return $resolver;
  }

  /**
   * @param array<string, mixed> $data
   *
   * @return array<string, mixed>
   */
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
  public function postMount(array $data): array
  {
    $data = $this->removeEmptyData($data);
    if (array_key_exists('disabled', $data))
    {
      if ($data['disabled'])
      {
        $data['aria-disabled'] = true;
        $this->removeUrl($data);
      }
      else
      {
        unset($data['disabled']);
      }
    }

    if ($this->isCurrent)
    {
      $data['class'] = 'current';
      $this->htmlTag = 'span';
    }

    if (!$this->title)
    {
      $this->title = $this->entitled;
    }

    if ($this->isInternal)
    {
      if (!array_key_exists('data-reload-trigger', $data))
      {
        $data['data-reload-trigger'] = '';
      }
      elseif (is_array($data['data-reload-trigger']))
      {
        $data['data-reload-trigger'] = json_encode($data['data-reload-trigger']);
      }
      if (array_key_exists('target', $data) && !$data['target'])
      {
        unset($data['target']);
      }

      if ($this->reloadTriggerOptions)
      {
        $data['data-reload-trigger-options'] = json_encode($this->reloadTriggerOptions);
      }
    }
    elseif ('a' == $this->htmlTag && (!array_key_exists('target', $data) || !$data['target']))
    {
      $this->target = '_blank';
      $data['target'] = $this->target;
    }
    if ('a' !== $this->htmlTag)
    {
      $this->removeUrl($data);
    }

    return $data;
  }

  /**
   * removeEmptyData
   *
   * @param array<string, mixed> $data
   *
   * @return array<string, mixed>
   */
  protected function removeEmptyData(array $data): array
  {
    foreach ($this->removeEmptyDataKeys as $key)
    {
      if (array_key_exists($key, $data) && (null === $data[$key] || '' === $data[$key]))
      {
        unset($data[$key]);
      }
    }

    return $data;
  }

  /**
   * removeUrl
   *
   * @param array<string, mixed> $data
   *
   * @return void
   */
  protected function removeUrl(array &$data): void
  {
    if (array_key_exists('href', $data))
    {
      unset($data['href']);
    }
    if (array_key_exists('target', $data))
    {
      unset($data['target']);
    }
    if (array_key_exists('data-reload-trigger', $data))
    {
      unset($data['data-reload-trigger']);
    }
  }
}
