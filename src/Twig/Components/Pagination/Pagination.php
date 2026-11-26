<?php

/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Austral\DesignBundle\Twig\Components\Pagination;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PostMount;
use Symfony\UX\TwigComponent\Attribute\PreMount;

#[AsTwigComponent('Austral:Pagination', template: '@AustralDesign/Twig/Components/Pagination/pagination.html.twig')]
final class Pagination
{
  public string $name = 'pagination';
  public string $position = 'top';

  public int $currentPage = 1;
  public int $totalPages = 1;

  public string $path = '';
  /**
   * @var array<string, mixed>
   */
  public array $pathParameters = [];
  public string $paginationOptions = '';

  public string $themeButton = 'outline';

  /**
   * @var array<array-key, array<string, mixed>>
   */
  public array $choices = [];

  /**
   * @var array<string, mixed>
   */
  private array $prevButtonDefault = [
    'entitled' => 'pager.button.prev',
    'hideEntitled' => false,
    'picto' => 'arrow-left',
    'path' => '',
    'pathParameters' => [],
  ];
  /**
   * @var array<string, mixed>
   */
  public array $prevButton = [];

  /**
   * @var array<string, mixed>
   */
  private array $nextButtonDefault = [
    'entitled' => 'pager.button.next',
    'hideEntitled' => false,
    'picto' => 'arrow-right',
    'path' => '',
    'pathParameters' => [],
  ];
  /**
   * @var array<string, mixed>
   */
  public array $nextButton = [];

  public string $choiceEntitled = 'pager.choice.entitled';

  public string $choiceValue = 'pager.choice.value';

  public function __construct(
    private readonly TranslatorInterface $translator
  ) {
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

    $resolver->setDefault('name', 'pagination')
      ->addAllowedTypes('name', ['string']);

    $resolver->setDefault('position', 'top')
      ->addAllowedTypes('position', ['string']);

    $resolver->setDefault('currentPage', 1)
      ->addAllowedTypes('currentPage', ['int']);

    $resolver->setDefault('totalPages', 1)
      ->addAllowedTypes('totalPages', ['int']);

    $resolver->setDefault('path', '')
      ->addAllowedTypes('path', ['string']);

    $resolver->setDefault('themeButton', 'outline')
      ->addAllowedTypes('themeButton', ['string']);

    $resolver->setDefault('pathParameters', [])
      ->addAllowedTypes('pathParameters', ['array']);

    $resolver->setDefault('paginationOptions', '')
      ->addAllowedTypes('paginationOptions', ['string']);

    $resolver->setDefault('prevButton', function (OptionsResolver $subResolver) {
      $subResolver->setPrototype(true)
        ->setDefaults(
          [
            'entitled' => 'pager.button.prev',
            'hideEntitled' => false,
            'picto' => 'arrow-left',
            'path' => '',
            'pathParameters' => [],
          ]
        )
        ->addAllowedTypes('entitled', ['string'])
        ->addAllowedTypes('hideEntitled', ['bool'])
        ->addAllowedTypes('picto', ['string'])
        ->addAllowedTypes('path', ['string'])
        ->addAllowedTypes('pathParameters', ['array']);
    });

    $resolver->setDefault('nextButton', function (OptionsResolver $subResolver) {
      $subResolver->setPrototype(true)
        ->setDefaults(
          [
            'entitled' => 'pager.button.next',
            'hideEntitled' => false,
            'picto' => 'arrow-right',
            'path' => '',
            'pathParameters' => [],
          ]
        )
        ->addAllowedTypes('entitled', ['string'])
        ->addAllowedTypes('hideEntitled', ['bool'])
        ->addAllowedTypes('picto', ['string'])
        ->addAllowedTypes('path', ['string'])
        ->addAllowedTypes('pathParameters', ['array']);
    });

    $resolver->setDefault('choiceEntitled', 'pager.choice.entitled')
      ->addAllowedTypes('choiceEntitled', ['string']);

    $resolver->setDefault('choiceValue', 'pager.choice.value')
      ->addAllowedTypes('choiceValue', ['string']);

    $resolver->setDefault('choices', [])
      ->addAllowedTypes('choices', ['array']);

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
    $this->prevButton = array_merge($this->prevButtonDefault, $this->prevButton);
    if ('' === $this->prevButton['path'])
    {
      $this->prevButton['path'] = $this->path;
    }
    if (0 === count($this->prevButton['pathParameters']))
    {
      $this->prevButton['pathParameters'] = $this->pathParameters;
    }
    $this->prevButton['pathParameters']['page'] = $this->currentPage - 1;

    $this->nextButton = array_merge($this->nextButtonDefault, $this->nextButton);
    if ('' === $this->nextButton['path'])
    {
      $this->nextButton['path'] = $this->path;
    }
    if (0 === count($this->nextButton['pathParameters']))
    {
      $this->nextButton['pathParameters'] = $this->pathParameters;
    }
    $this->nextButton['pathParameters']['page'] = $this->currentPage + 1;

    if ($this->totalPages <= 0)
    {
      $this->totalPages = 1;
    }
    for ($page = 1; $page <= $this->totalPages; ++$page)
    {
      $this->choices[] = [
        'entitled' => $this->translator->trans($this->choiceValue, ['%numPage%' => $page, '%totalPages%' => $this->totalPages]),
        'value' => $page,
      ];
    }

    return $data;
  }
}
