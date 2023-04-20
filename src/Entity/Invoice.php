<?php

namespace App\Entity;


use Model\Operation;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Post;
use Doctrine\DBAL\Types\Types;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\InvoiceRepository;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Controller\IncrementInvoiceChronoController;
use ApiPlatform\OpenApi\Model\Operation as ModelOperation;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: InvoiceRepository::class)]
#[ApiResource(  
    operations: [
        new GetCollection(
            //paginationEnabled: true,  
            // paginationItemsPerPage: 30, # surcharger la configuratin par defaut
            // paginationClientEnabled: true, # surcharger la configuratin par defaut
            //paginationClientItemsPerPage: true,
            // order: ['sentAt' => 'DESC',],
            
        ),
        new Get(
            requirements: ['id' => '\d+'], 
        ) , 
        new Post(),
        new Delete(),
        new Put(),
        new Patch(),
    ] ,
    normalizationContext:['groups'=>['invoices:read']],
    denormalizationContext:['disable_type_enforcement'=>true]
)]
#[ApiResource(
    uriTemplate: '/customers/{id}/factures', 
    uriVariables: [
        'id' => new Link(
            fromClass: Customer::class,
            fromProperty: 'invoices',
        )
    ], 
    operations: [new GetCollection()],
    normalizationContext: ['groups' => ['invoices_subressource']],
)]
#[ApiResource(
    operations:[
        new Post(
            name: 'increment',
            uriTemplate: '/invoices/{id}/increment',
            controller: IncrementInvoiceChronoController::class,
            openapi:new ModelOperation(
                summary: 'increment chrono\'s invoice',
            )
        )
    ]
)]
#[ApiFilter(OrderFilter::class , properties:['amount','sentAt'] ,arguments: ['orderParameterName' => 'order'])]
class Invoice
{
    const PAYED     = 'payed';
    const CANCELED  = 'canceled';
    const SENT      = 'sent';
    
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['invoices:read','customers:read','invoices_subressource'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['invoices:read','customers:read','invoices_subressource'])]
    #[Assert\NotBlank(message:"le montant doit être renseigner")]
    #[Assert\Type(type:'numeric',message:"le montant de la facture doit être numeric")]
    private  $amount = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['invoices:read','customers:read','invoices_subressource'])]
    #[Assert\NotBlank(message:"la date doit être renseigner")]
    #[Assert\Type('DateTimeInterface' , message:"la date doit être au format YYYY-MM-DD")]

    private  $sentAt = null;

    #[ORM\Column(length: 255)]
    #[Groups(['invoices:read','customers:read','invoices_subressource'])]
    #[Assert\NotBlank(message:"le montant doit être renseigner")]
    #[Assert\Choice(choices:[self::CANCELED,self::PAYED,self::SENT],message:"status possible ".self::CANCELED.", ".self::PAYED.', '.self::SENT)]
    private ?string $status = null;

    #[ORM\ManyToOne(inversedBy: 'invoices')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['invoices:read'])]
    #[Assert\NotBlank(message:"le client ne peut pas être vide")]
    private ?Customer $customer = null;

    #[ORM\Column]
    #[Groups(['invoices:read','customers:read','invoices_subressource'])]
    #[Assert\NotBlank(message:"le montant doit être renseigner")]
    #[Assert\Type(type:'integer',message:"le chrono de la facture doit être un entier")]
    
    private  $chrono = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount( $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt( $sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono( $chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
    /**
     * return the user's invoice
     *
     * @return User
     */
    #[Groups(['invoices:read','invoices_subressource'])]
    public function getUser():User
    {
       
        return $this->customer->getUser();
    }
    
}