<?php

/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Austral\DesignBundle\Twig\Components\Button;

use Austral\DesignBundle\Twig\Base\Action;
use Austral\ToolsBundle\AustralTools;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PostMount;
use Symfony\UX\TwigComponent\Attribute\PreMount;

#[AsTwigComponent('Austral:Button', template: '@AustralDesign/Twig/Components/Button/button.html.twig')]
final class Button extends Action
{
  public ?string $size = 'default';
  public ?string $type = 'button';
  public ?string $align = 'centered';
  public ?string $theme = 'solid';
  public ?string $color = 'primary';
  public ?string $keyname = '';

  public ?bool $full = false;
  public ?bool $hideEntitled = false;
  public ?bool $animate = false;
  public ?bool $pictoLoad = null;

  protected string $sizeDefault;
  protected string $themeDefault;
  protected string $colorDefault;
  protected string $alignDefault;

  /**
   * @param array<string, array<string, mixed>> $componentDefaultValue
   */
  public function __construct(
    protected array $componentDefaultValue,
  ) {
    parent::__construct();
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
    $resolver = parent::optionsResolver($resolver);

    $resolver->setDefault('htmlTag', 'a')
      ->setAllowedValues('htmlTag', ['a', 'span', 'button']);

    $resolver->setDefault('keyname', '')
      ->addAllowedTypes('keyname', ['string']);

    $resolver->setDefault('type', 'button')
      ->setAllowedValues('type', ['submit', 'button'])
      ->addAllowedTypes('type', ['string']);

    $resolver->setDefault('size', 'default')
      ->setAllowedValues('size', ['default', 'lg', 'md', 'sm', 'xs'])
      ->addAllowedTypes('size', ['string']);

    $resolver->setDefault('theme', 'solid')
      ->addAllowedTypes('theme', ['string']);

    $resolver->setDefault('color', 'primary')
      ->addAllowedTypes('color', ['string']);

    $resolver->setDefault('align', 'centered')
      ->setAllowedValues('align', ['default', 'centered', 'extended'])
      ->addAllowedTypes('align', ['string']);

    $resolver->setDefault('full', null)
      ->addAllowedTypes('full', ['null', 'boolean']);

    $resolver->setDefault('animate', false)
      ->addAllowedTypes('animate', ['boolean']);

    $resolver->setDefault('pictoLoad', null)
      ->addAllowedTypes('pictoLoad', ['null', 'boolean']);

    $resolver->setDefault('hideEntitled', false)
      ->addAllowedTypes('hideEntitled', ['boolean']);

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
    $data = parent::postMount($data);

    if (array_key_exists($this->keyname, $this->componentDefaultValue))
    {
      $this->sizeDefault = $this->componentDefaultValue[$this->keyname]['size'];
      $this->themeDefault = $this->componentDefaultValue[$this->keyname]['theme'];
      $this->colorDefault = $this->componentDefaultValue[$this->keyname]['color'];
      $this->alignDefault = $this->componentDefaultValue[$this->keyname]['align'];
    }
    else
    {
      $this->sizeDefault = $this->componentDefaultValue['button']['size'];
      $this->themeDefault = $this->componentDefaultValue['button']['theme'];
      $this->colorDefault = $this->componentDefaultValue['button']['color'];
      $this->alignDefault = $this->componentDefaultValue['button']['align'];
    }

    if (null === $this->pictoLoad && 'button' === $this->htmlTag && 'submit' === $this->type)
    {
      $this->pictoLoad = true;
      if (!array_key_exists('id', $data))
      {
        $data['id'] = AustralTools::strip('Button '.($this->title ?? $this->entitled));
      }
    }

    if ('default' === $this->theme)
    {
      $this->theme = $this->themeDefault;
    }
    if ('default' === $this->color)
    {
      $this->color = $this->colorDefault;
    }
    if ('default' === $this->size)
    {
      $this->size = $this->sizeDefault;
    }
    if ('default' === $this->align)
    {
      $this->align = $this->alignDefault;
    }

    if (!array_key_exists('options', $this->componentDefaultValue['button']))
    {
      throw new \Exception('Button options not defined in configuration');
    }

    if (!in_array($this->theme, $this->componentDefaultValue['button']['options']['themes']))
    {
      throw new \Exception("Theme '{$this->theme}' not found in component default value");
    }

    if (!in_array($this->color, $this->componentDefaultValue['button']['options']['colors']))
    {
      throw new \Exception("Color '{$this->color}' not found in component default value");
    }

    $data['role'] = 'button';
    $data['type'] = $this->type;

    return $data;
  }
}
