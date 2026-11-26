<?php

/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Austral\DesignBundle\Twig\Components\Picto;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PostMount;
use Symfony\UX\TwigComponent\Attribute\PreMount;

#[AsTwigComponent('Austral:Picto', template: '@AustralDesign/Twig/Components/Picto/picto.html.twig')]
final class Picto
{
  public ?string $name = null;
  public string $format = 'svg';
  public ?string $value = null;
  public ?string $size = 'md';
  public ?string $theme = 'stroke';

  /**
   * @var array{path: list<string>, formats: list<string>, default: string}
   */
  private array $componentPictoParameters;

  /**
   * @param array{path: list<string>, formats: list<string>, default: string} $componentPictoParameters
   */
  public function __construct(
    array $componentPictoParameters,
  ) {
    $this->componentPictoParameters = $componentPictoParameters;
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
    $resolver->setIgnoreUndefined(true);

    $resolver->setDefault('name', null)
      ->addAllowedTypes('name', ['null', 'string']);

    $resolver->setDefault('theme', 'stroke')
      ->addAllowedTypes('theme', ['string'])
      ->setAllowedValues('theme', ['stroke', 'fill', 'all']);

    $resolver->setDefault('format', 'svg')
      ->setAllowedValues('format', $this->componentPictoParameters['formats'])
      ->addAllowedTypes('format', ['string']);

    $resolver->setDefault('size', 'md')
      ->setAllowedValues('size', ['sm', 'md', 'lg'])
      ->addAllowedTypes('size', ['string']);

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
    if (!$this->value)
    {
      foreach ($this->componentPictoParameters['path'] as $path)
      {
        if (!$this->name)
        {
          $this->name = $this->componentPictoParameters['default'];
        }

        $filepath = $path.'/'.$this->name.'.'.$this->format;
        if (file_exists($filepath) && !$this->value)
        {
          $this->value = file_get_contents($filepath);
        }
      }
    }
    return $data;
  }
}
