"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";

interface VendaDisco {
  id: number;
  disco: string;
  artista: string;
  quantidade: number;
  preco: string;
  status: "Entregue" | "Pendente" | "Cancelada";
  imagem: string;
}

const vendas: VendaDisco[] = [
  {
    id: 1,
    disco: "Abbey Road",
    artista: "The Beatles",
    quantidade: 2,
    preco: "R$ 179,80",
    status: "Entregue",
    imagem: "/images/product/product-01.jpg",
  },
  {
    id: 2,
    disco: "Thriller",
    artista: "Michael Jackson",
    quantidade: 1,
    preco: "R$ 79,90",
    status: "Pendente",
    imagem: "/images/product/product-02.jpg",
  },
  {
    id: 3,
    disco: "Dark Side of the Moon",
    artista: "Pink Floyd",
    quantidade: 1,
    preco: "R$ 99,90",
    status: "Entregue",
    imagem: "/images/product/product-03.jpg",
  },
  {
    id: 4,
    disco: "Construção",
    artista: "Chico Buarque",
    quantidade: 3,
    preco: "R$ 209,70",
    status: "Cancelada",
    imagem: "/images/product/product-04.jpg",
  },
  {
    id: 5,
    disco: "Clube da Esquina",
    artista: "Milton Nascimento",
    quantidade: 2,
    preco: "R$ 149,80",
    status: "Entregue",
    imagem: "/images/product/product-05.jpg",
  },
];

const statusColor: Record<string, "success" | "warning" | "error"> = {
  Entregue: "success",
  Pendente: "warning",
  Cancelada: "error",
};

export default function VendasRecentes() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
        Vendas Recentes
      </h3>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader className="min-w-[200px] px-4 py-3">
                Disco
              </TableCell>
              <TableCell isHeader className="min-w-[150px] px-4 py-3">
                Artista
              </TableCell>
              <TableCell isHeader className="px-4 py-3">
                Qtd.
              </TableCell>
              <TableCell isHeader className="min-w-[120px] px-4 py-3">
                Valor
              </TableCell>
              <TableCell isHeader className="min-w-[120px] px-4 py-3">
                Status
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendas.map((venda) => (
              <TableRow key={venda.id}>
                <TableCell className="px-4 py-4">
                  <div className="font-medium text-gray-800 dark:text-white">
                    {venda.disco}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4 text-gray-600 dark:text-gray-400">
                  {venda.artista}
                </TableCell>
                <TableCell className="px-4 py-4 text-gray-800 dark:text-white font-medium">
                  {venda.quantidade}
                </TableCell>
                <TableCell className="px-4 py-4 font-semibold text-gray-800 dark:text-white">
                  {venda.preco}
                </TableCell>
                <TableCell className="px-4 py-4">
                  <Badge
                    color={statusColor[venda.status]}
                  >
                    {venda.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
