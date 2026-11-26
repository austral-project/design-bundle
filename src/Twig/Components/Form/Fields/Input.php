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

#[AsTwigComponent('Austral:Form:Fields:Input', template: '@AustralDesign/Twig/Components/Form/Fields/input.html.twig')]
class Input extends BaseField
{
  public string $type = 'text';

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

    $resolver->setDefault('type', 'text')
      ->addAllowedTypes('type', ['null', 'string']);

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
    if (in_array($this->type, ['range', 'color']))
    {
      $data['required'] = false;
    }
    if (array_key_exists('checked', $data) && true === $data['checked'])
    {
      $data['checked'] = 'checked';
    }

    return $data;
  }
}
