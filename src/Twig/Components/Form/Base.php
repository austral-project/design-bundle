<?php

/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Austral\DesignBundle\Twig\Components\Form;

use Symfony\Component\OptionsResolver\OptionsResolver;

abstract class Base
{
  /**
   * @var array<string, mixed>
   */
  public array $attr = [];

  public function __construct()
  {
  }

  /**
   * @param array<string, mixed> $data
   *
   * @return array<string, mixed>
   */
  public function preMount(array $data): array
  {
    $resolver = new OptionsResolver();
    $resolver->setIgnoreUndefined(true);

    $resolver->setDefault('attr', [])
      ->setAllowedTypes('attr', ['null', 'array']);

    return $resolver->resolve($data) + $data;
  }

  /**
   * @param array<string, mixed> $data
   *
   * @return array<string, mixed>
   */
  public function postMount(array $data): array
  {
    foreach ($this->attr as $key => $value)
    {
      $data[$key] = false === $value ? $key : $value;
    }

    return $data;
  }
}
