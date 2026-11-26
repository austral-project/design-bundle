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

#[AsTwigComponent('Austral:Form:Fields:Upload', template: '@AustralDesign/Twig/Components/Form/Fields/upload.html.twig')]
class Upload extends BaseField
{
  /**
   * @var array<string, mixed>
   */
  public array $uploadOptions = [];
  public string $uploadContainerId = '';

  public string $fieldname = '';

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
    $resolver->setDefault('fieldname', '')
      ->addAllowedTypes('fieldname', ['string']);

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
    // form.vars.austral.widget of an UploadField (form-bundle), the current file filled by entity-file-bundle
    $widget = $this->field['widget'] ?? null;
    if (is_array($widget))
    {
      $file = $widget['file'] ?? null;
      $this->uploadContainerId = $this->id.'-upload-container';
      $this->uploadOptions = [
        'max-size' => $widget['max_size'] ?? null,
        'mime-types' => $widget['mime_types'] ?? [],
        'image-sizes' => $widget['image_sizes'] ?? [],
        'file-container' => "#{$this->uploadContainerId}",
        'input-file' => "#{$this->id}",
        'fieldname' => $this->fieldname,
        'cropper' => $widget['cropper'] ?? [],
        'file-path' => $file['path']['view'] ?? null,
        'file-values' => ['file' => $file],
        'delete-field-element' => "*[data-delete-files='{$this->id}']",
      ];
    }

    return $data;
  }
}
