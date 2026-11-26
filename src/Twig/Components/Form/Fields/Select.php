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

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PostMount;
use Symfony\UX\TwigComponent\Attribute\PreMount;

#[AsTwigComponent('Austral:Form:Fields:Select', template: '@AustralDesign/Twig/Components/Form/Fields/select.html.twig')]
final class Select extends BaseField
{
  /**
   * @var array<array-key, mixed>
   */
  public array $choices = [];
  public bool $multiple = false;

  public string $placeholder = '';
  /**
   * @var array<string, mixed>
   */
  public array $placeholderAttributes = [];
  public string $placeholderAttributesString = '';
  /**
   * @var array<string, mixed>
   */
  public array $dataSelectOptions = [
    'tag' => false,
    'addItems' => true,
    'editItems' => true,
    'removeItems' => true,
    'function' => null,
    'searchEnabled' => true,
    'searchResultLimit' => 10,
    'placeholder' => true,
    'placeholderValue' => null,
    'searchPlaceholderValue' => null,
    'delimiter' => ', ',
    'duplicateItemsAllowed' => false,
    'shouldSort' => false,
  ];

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

    $resolver->setDefault('choices', [])
      ->addAllowedTypes('choices', ['null', 'array']);

    $resolver->setDefault('multiple', false)
      ->addAllowedTypes('multiple', ['boolean']);

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
    if (count($this->placeholderAttributes) > 0)
    {
      $placeholderAttributesTmp = [];
      foreach ($this->placeholderAttributes as $key => $value)
      {
        $placeholderAttributesTmp[] = $key.'='.$value;
      }
      $this->placeholderAttributesString = implode(' ', $placeholderAttributesTmp);
    }

    if (!array_key_exists('data-select', $data))
    {
      $data['data-select'] = '';
    }

    if (array_key_exists('data-select-options', $data) && $data['data-select-options'])
    {
      $this->dataSelectOptions = json_decode($data['data-select-options'], true);
      unset($data['data-select-options']);
    }

    return $data;
  }
}
