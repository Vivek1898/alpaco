"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NETWORKS } from "@/lib/constants";

interface NetworkSelectorProps {
  selected: typeof NETWORKS[number];
  onSelect: (network: typeof NETWORKS[number]) => void;
}

export function NetworkSelector({ selected, onSelect }: NetworkSelectorProps) {
  return (
    <Select
      value={selected.network_slug}
      onValueChange={(value) => {
        const network = NETWORKS.find((n) => n.network_slug === value);
        if (network) onSelect(network);
      }}
    >
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select network" />
      </SelectTrigger>
      <SelectContent>
        {NETWORKS.map((network) => (
          <SelectItem key={network.id} value={network.network_slug}>
            {network.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}