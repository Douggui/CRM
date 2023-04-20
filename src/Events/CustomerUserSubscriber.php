<?php
namespace App\Events;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Customer;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\KernelEvent;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class CustomerUserSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private Security $security
    )
    {
        
    }
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW =>['createCustomer',EventPriorities::PRE_VALIDATE],
        ];
    }

    public function createCustomer(ViewEvent $viewEvent)
    {

        $result = $viewEvent->getControllerResult();
        $method = $viewEvent->getRequest()->getMethod();

        if($result instanceof Customer && $method === 'POST')
        {
            $user = $this->security->getUser();
            $result->setUser($user);
            

            
        }

    }
}