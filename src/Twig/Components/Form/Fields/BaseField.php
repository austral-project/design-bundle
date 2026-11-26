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

use Austral\DesignBundle\Twig\Components\Form\Base;
use Symfony\Component\OptionsResolver\OptionsResolver;

abstract class BaseField extends Base
{
  public ?string $id = '';
  public ?string $name = '';
  public bool $disabled = false;
  public bool $required = false;
  public ?string $value = '';
  /**
   * @var array<string, mixed>
   */
  public array $datas = [];
  public bool $hidden = false;

  /**
   * Presentation of the field given by form-bundle (form.vars.austral of the view contract).
   *
   * @var array<string, mixed>|null
   */
  public ?array $field = null;

  /**
   * @var list<string>
   */
  protected array $deleteAttributes = [
    'before',
    'after',
    'error',
    'label',
  ];

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

    $resolver->setDefault('field', null)
      ->addAllowedTypes('field', ['null', 'array']);

    $resolver->setDefault('id', null)
      ->addAllowedTypes('id', ['null', 'string']);

    $resolver->setDefault('name', null)
      ->addAllowedTypes('name', ['null', 'string']);

    $resolver->setDefault('disabled', false)
      ->addAllowedTypes('disabled', ['boolean']);

    $resolver->setDefault('required', false)
      ->addAllowedTypes('required', ['boolean']);

    $resolver->setDefault('hidden', false)
      ->addAllowedTypes('hidden', ['boolean']);

    $resolver->setDefault('datas', [])
      ->addAllowedTypes('datas', ['array']);

    $resolver->setDefault('value', '');

    return $resolver;
  }

  /**
   * @param array<string, mixed> $data
   *
   * @return array<string, mixed>
   */
  public function preMount(array $data): array
  {
    $data = parent::preMount($data);
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
    $data = parent::postMount($data);
    if ($this->disabled)
    {
      $data['disabled'] = true;
    }
    if ($this->required)
    {
      $data['required'] = true;
    }

    foreach ($this->datas as $key => $value)
    {
      $data[$key] = $value;
    }

    foreach ($this->deleteAttributes as $attribute)
    {
      if (array_key_exists($attribute, $data))
      {
        unset($data[$attribute]);
      }
    }

    return $data;
  }
}
