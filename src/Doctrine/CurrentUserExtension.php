<?php
namespace App\Doctrine;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use Doctrine\ORM\QueryBuilder;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Security;

class CurrentUserExtension implements 
QueryCollectionExtensionInterface,
QueryItemExtensionInterface
{
    public function __construct(
        private Security $security,
        private AuthorizationCheckerInterface $auth,
    )
    {
        
    }
    private function addWhere(
        QueryBuilder $queryBuilder,
        string $resourceClass
        )
    {
        $user = $this->security->getUser();
        
        if(
            ($resourceClass === Invoice::class || $resourceClass === Customer::class)
             && !$this->auth->isGranted('ROLE_ADMIN')
             && $user instanceof User
             )
             {
           $rootAlias = $queryBuilder->getRootAliases()[0];
           if($resourceClass === Customer::class){
                $queryBuilder->andWhere($rootAlias.'.user = :user')
                            ;
           }
           if($resourceClass === Invoice::class){
            $queryBuilder->join($rootAlias.'.customer','c')
                        ->andWhere('c.user = :user')
                        ;
           } 
           $queryBuilder->setParameter('user',$user);
        }
    }
    public function applyToCollection(
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        ?Operation $operation = null,
        array $context = []): void
    {
        $this->addWhere($queryBuilder,$resourceClass);
        //     dd('u');
        
    }
    public function applyToItem(
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        array $identifiers,
        ?Operation $operation = null,
        array $context = []): void
    {
        $this->addWhere($queryBuilder,$resourceClass);
    }

}