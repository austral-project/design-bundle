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

#[AsTwigComponent('Austral:Form:Fields:Textarea', template: '@AustralDesign/Twig/Components/Form/Fields/textarea.html.twig')]
final class Textarea extends BaseField
{
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

    return $data;
  }
}
