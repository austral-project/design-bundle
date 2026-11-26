<?php

/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Austral\DesignBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

/**
 * Austral Design Configuration.
 *
 * austral_design:
 *   build: entrypoints.json of the compiled build read by austral_design_styles() and austral_design_scripts();
 *          the build of the bundle by default. A project that builds the design system itself (encore.mjs) gives
 *          its own, e.g. "%kernel.project_dir%/public/build/entrypoints.json".
 *
 * @author Matthieu Beurel <matthieu@austral.dev>
 */
class Configuration implements ConfigurationInterface
{
  /**
   * {@inheritDoc}
   */
  public function getConfigTreeBuilder(): TreeBuilder
  {
    $treeBuilder = new TreeBuilder('austral_design');
    $treeBuilder->getRootNode()
      ->addDefaultsIfNotSet()
      ->children()
        ->scalarNode('build')
          ->defaultNull()
          ->info('entrypoints.json of the compiled build (null: the build of the bundle)')
          ->example('%kernel.project_dir%/public/build/entrypoints.json')
          ->validate()
            ->ifTrue(static fn (mixed $value): bool => null !== $value && (!\is_string($value) || '' === trim($value)))
            ->thenInvalid('The build must be the path of an entrypoints.json file, %s given.')
          ->end()
        ->end()
      ->end();

    return $treeBuilder;
  }
}
