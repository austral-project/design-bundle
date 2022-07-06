<?php
/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Austral\DesignBundle;

use Austral\DesignBundle\DependencyInjection\Compiler\DesignCompiler;
use Symfony\Component\DependencyInjection\Compiler\PassConfig;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

/**
 * Austral Design Bundle.
 * @author Matthieu Beurel <matthieu@austral.dev>
 */
class AustralDesignBundle extends Bundle
{

  /**
   * @param ContainerBuilder $container
   */
  public function build(ContainerBuilder $container)
  {
    parent::build($container);
    $container->addCompilerPass(new DesignCompiler(), PassConfig::TYPE_BEFORE_OPTIMIZATION, 1000);
  }
  
}
