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

#[AsTwigComponent('Austral:Form:Label', template: '@AustralDesign/Twig/Components/Form/label.html.twig')]
final class Label extends Base
{
  public string $tag = 'label';
  public string $entitled = 'entitled';
  public string $entitledValue = '';

  /**
   * @param array<string, mixed> $data
   *
   * @return array<string, mixed>
   */
  #[PreMount]
  public function preMount(array $data): array
  {
    $resolver = new OptionsResolver();
    $resolver->setIgnoreUndefined(true);

    $resolver->setDefault('tag', 'label')
      ->addAllowedTypes('tag', ['null', 'string']);

    $resolver->setDefault('entitled', null)
      ->addAllowedTypes('entitled', ['null', 'string']);

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
    $this->entitledValue = $this->entitled;

    return $data;
  }
}
