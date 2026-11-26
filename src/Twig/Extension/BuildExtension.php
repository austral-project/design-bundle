<?php

/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Austral\DesignBundle\Twig\Extension;

use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Contracts\Service\ResetInterface;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

/**
 * Tags of the compiled build of the design system (src/Resources/public/build, read from its entrypoints.json):
 * - austral_design_styles('austral-design'): the <link> tags of an entry;
 * - austral_design_scripts('austral-design'): the <script> tags of an entry (deferred by default).
 * A file shared by two entries is rendered once per page. The URLs are prefixed with the base path of the
 * request (application in a sub-folder); the files are already versioned by the build.
 *
 * @author Matthieu Beurel <matthieu@austral.dev>
 *
 * @final
 */
class BuildExtension extends AbstractExtension implements ResetInterface
{
  /**
   * @var array<string, array{js?: list<string>, css?: list<string>}>|null
   */
  private ?array $entrypoints = null;

  /**
   * @var array<string, true>
   */
  private array $rendered = [];

  /**
   * @param string            $entrypointsPath
   * @param RequestStack|null $requestStack
   */
  public function __construct(
    private readonly string $entrypointsPath,
    private readonly ?RequestStack $requestStack = null,
  ) {
  }

  /**
   * @return list<TwigFunction>
   */
  public function getFunctions(): array
  {
    return [
      new TwigFunction('austral_design_styles', $this->styles(...), ['is_safe' => ['html']]),
      new TwigFunction('austral_design_scripts', $this->scripts(...), ['is_safe' => ['html']]),
    ];
  }

  /**
   * @param string                          $entry
   * @param array<string, string|bool|null> $attributes
   *
   * @return string
   */
  public function styles(string $entry = 'austral-design', array $attributes = []): string
  {
    $tags = [];
    foreach ($this->files($entry, 'css') as $file)
    {
      $tags[] = \sprintf('<link%s>', $this->attributes(['rel' => 'stylesheet', 'href' => $this->url($file)] + $attributes));
    }

    return implode("\n", $tags);
  }

  /**
   * @param string                          $entry
   * @param array<string, string|bool|null> $attributes
   *
   * @return string
   */
  public function scripts(string $entry = 'austral-design', array $attributes = ['defer' => true]): string
  {
    $tags = [];
    foreach ($this->files($entry, 'js') as $file)
    {
      $tags[] = \sprintf('<script%s></script>', $this->attributes(['src' => $this->url($file)] + $attributes));
    }

    return implode("\n", $tags);
  }

  /**
   * Forgets the files already rendered (between two requests of a long-running process).
   */
  public function reset(): void
  {
    $this->rendered = [];
  }

  /**
   * @param string $entry
   * @param string $type
   *
   * @return list<string> the files of the entry not rendered yet
   */
  private function files(string $entry, string $type): array
  {
    $entrypoints = $this->entrypoints();
    if (!\array_key_exists($entry, $entrypoints))
    {
      throw new \InvalidArgumentException(\sprintf('The entry "%s" is not in the build of the design system (%s). Available entries: "%s".', $entry, $this->entrypointsPath, implode('", "', array_keys($entrypoints))));
    }

    $files = [];
    foreach ($entrypoints[$entry][$type] ?? [] as $file)
    {
      if (!isset($this->rendered[$file]))
      {
        $this->rendered[$file] = true;
        $files[] = $file;
      }
    }

    return $files;
  }

  /**
   * @return array<string, array{js?: list<string>, css?: list<string>}>
   */
  private function entrypoints(): array
  {
    if (null === $this->entrypoints)
    {
      if (!is_file($this->entrypointsPath))
      {
        throw new \RuntimeException(\sprintf('The build of the design system is missing: "%s" does not exist.', $this->entrypointsPath));
      }
      $content = json_decode((string) file_get_contents($this->entrypointsPath), true, 512, \JSON_THROW_ON_ERROR);
      if (!\is_array($content) || !\is_array($content['entrypoints'] ?? null))
      {
        throw new \RuntimeException(\sprintf('"%s" is not an entrypoints file of Webpack Encore.', $this->entrypointsPath));
      }
      /** @var array<string, array{js?: list<string>, css?: list<string>}> $entries */
      $entries = $content['entrypoints'];
      $this->entrypoints = $entries;
    }

    return $this->entrypoints;
  }

  /**
   * @param string $file
   *
   * @return string
   */
  private function url(string $file): string
  {
    return ($this->requestStack?->getMainRequest()?->getBasePath() ?? '').$file;
  }

  /**
   * @param array<string, string|bool|null> $attributes
   *
   * @return string
   */
  private function attributes(array $attributes): string
  {
    $html = '';
    foreach ($attributes as $name => $value)
    {
      if (null === $value || false === $value)
      {
        continue;
      }
      $html .= true === $value
        ? ' '.htmlspecialchars($name, \ENT_QUOTES)
        : \sprintf(' %s="%s"', htmlspecialchars($name, \ENT_QUOTES), htmlspecialchars($value, \ENT_QUOTES));
    }

    return $html;
  }
}
