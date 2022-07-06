<?php
/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Austral\DesignBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\Argument\ServiceClosureArgument;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Definition;
use Symfony\Component\DependencyInjection\Reference;

/**
 * Austral Design Compiler.
 * @author Matthieu Beurel <matthieu@austral.dev>
 * @final
 */
class DesignCompiler implements CompilerPassInterface
{
  /**
   * Init Configuration Austral Admin with all parameters defined
   * @var ContainerBuilder $container
   */
  public function process(ContainerBuilder $container)
  {
    /*
     * Add auto definition Webpack Encore
     */

    $nameDefinition = "austral-design";

    $urlEntrypoint = $container->getParameterBag()->get("kernel.project_dir")."/public/bundles/australdesign/build/entrypoints.json";
    $container->setDefinition("webpack_encore.entrypoint_lookup[{$nameDefinition}]", new Definition("Symfony\WebpackEncoreBundle\Asset\EntrypointLookup", array(
      $urlEntrypoint,
      null,
      $nameDefinition,
      true
    )));

    $definition = $container->findDefinition("webpack_encore.entrypoint_lookup_collection");
    $definition->addArgument($nameDefinition);
    /** @var Reference $reference */
    $reference = $definition->getArgument(0);

    $definition = $container->findDefinition($reference->__toString());
    $argument = $definition->getArgument(0);
    $argument[$nameDefinition] = new ServiceClosureArgument(new Reference("webpack_encore.entrypoint_lookup[{$nameDefinition}]", 1));
    $definition->setArgument(0, $argument);

    $definition = $container->findDefinition("webpack_encore.entrypoint_lookup.cache_warmer");
    $argument = $definition->getArgument(0);
    $argument[$nameDefinition]  = $urlEntrypoint;
    $definition->setArgument(0, $argument);

    $definition = $container->findDefinition("webpack_encore.exception_listener");
    $argument = $definition->getArgument(1);
    $argument[] = $nameDefinition;
    $definition->setArgument(1, $argument);
    
  }
}