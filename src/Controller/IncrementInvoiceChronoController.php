<?php
namespace App\Controller;

use App\Entity\Invoice;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[AsController]
class IncrementInvoiceChronoController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $manager
    )
    {
        
    }
    public function __invoke(Invoice $data)
    {
        $data->setChrono($data->getChrono()+1);
        $this->manager->flush();
        return $data;
    }
    
}