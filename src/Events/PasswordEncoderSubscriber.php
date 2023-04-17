<?php
namespace App\Events;

use App\Entity\User;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Symfony\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class PasswordEncoderSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private UserPasswordHasherInterface $userPasswordHasher
    )
    {
        
    }
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['encoderPassword',EventPriorities::PRE_WRITE],
        ];
    }
    public function encoderPassword(ViewEvent $viewEvent)
    {
        $result = $viewEvent->getControllerResult();
        $method = $viewEvent->getRequest()->getMethod(); //POST GET PUT...

        
        if($result instanceof User && $method === 'POST')
        {
            $password = $result->getPassword();
            $result->setPassword($this->userPasswordHasher->hashPassword($result,$password));
        }
    }
}