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
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PostMount;
use Symfony\UX\TwigComponent\Attribute\PreMount;

#[AsTwigComponent('Austral:Form:Row', template: '@AustralDesign/Twig/Components/Form/row.html.twig')]
final class Row extends Base
{
  public string $tag = 'div';
  public ?string $typeField = null;
  public string $name = 'fieldname';
  public bool $reverse = false;
  public bool $required = false;
  public bool $disabled = false;
  public string $fieldClassContainer = '';
  public ?string $labelPosition = null;
  public ?string $errorValue = null;

  public ?string $helperValue = null;

  public ?string $beforeValue = null;
  public bool $beforeBackground = false;

  public ?string $afterValue = null;
  public bool $afterBackground = false;

  public ?bool $animateLabel = null;

  /**
   * @param array<string, mixed> $data
   *
   * @return array<string, mixed>
   */
  #[PreMount]
  public function preMount(array $data): array
  {
    $data = parent::preMount($data);
    $resolver = new OptionsResolver();
    $resolver->setIgnoreUndefined(true);

    $resolver->setDefault('tag', 'div')
      ->addAllowedTypes('tag', ['null', 'string']);

    $resolver->setDefault('name', 'fieldname')
      ->addAllowedTypes('name', ['null', 'string']);

    $resolver->setDefault('errorValue', null)
      ->addAllowedTypes('errorValue', ['null', 'string']);

    $resolver->setDefault('reverse', false)
      ->addAllowedTypes('reverse', ['boolean']);

    $resolver->setDefault('disabled', false)
      ->addAllowedTypes('disabled', ['boolean']);

    $resolver->setDefault('animateLabel', null)
      ->addAllowedTypes('animateLabel', ['boolean', 'null']);

    $resolver->setDefault('labelPosition', null)
      ->addAllowedTypes('labelPosition', ['string', 'null']);

    $resolver->setDefault('required', false)
      ->addAllowedTypes('required', ['boolean']);

    $resolver->setDefault('helperValue', null)
      ->addAllowedTypes('helperValue', ['null', 'string']);

    $resolver->setDefault('beforeValue', null)
      ->addAllowedTypes('beforeValue', ['null', 'string']);

    $resolver->setDefault('beforeBackground', false)
      ->addAllowedTypes('beforeBackground', ['boolean']);

    $resolver->setDefault('afterValue', null)
      ->addAllowedTypes('afterValue', ['null', 'string']);

    $resolver->setDefault('afterBackground', false)
      ->addAllowedTypes('afterBackground', ['boolean']);

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

    if (!array_key_exists('class', $data))
    {
      $data['class'] = '';
    }
    if ($this->reverse)
    {
      $data['class'] .= ' reverse';
    }
    if ($this->disabled)
    {
      $data['class'] .= ' disabled';
    }
    if ($this->required)
    {
      $data['class'] .= ' required';
    }

    if ($this->typeField)
    {
      $this->fieldClassContainer .= " field-container-type-{$this->typeField}";
    }

    return $data;
  }
}
