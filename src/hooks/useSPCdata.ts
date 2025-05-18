import { useState, useEffect } from "react";
import { 
  ShiftData, 
  MaterialData, 
  OperationData, 
  GuageData,
  fetchShiftData,
  fetchMaterialList,
  fetchOperationList,
  fetchGuageList
} from "@/app/api/specApi";

interface UseSPCDataParams {
  startDate: Date;
  endDate: Date;
  selectedShifts: number[];
  material: string;
  operation: string;
}

export function useSPCData({ 
  startDate, 
  endDate, 
  selectedShifts, 
  material, 
  operation 
}: UseSPCDataParams) {
  const [shifts, setShifts] = useState<ShiftData[]>([]);
  const [materials, setMaterials] = useState<MaterialData[]>([]);
  const [operations, setOperations] = useState<OperationData[]>([]);
  const [gauges, setGauges] = useState<GuageData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch shifts
  useEffect(() => {
    const getShifts = async () => {
      try {
        const response = await fetchShiftData();
        if (response.success) {
          setShifts(response.data);
          setError(null);
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        setError("Failed to fetch shifts");
        console.error(err);
      }
    };
    getShifts();
  }, []);

  // Fetch materials
  useEffect(() => {
    const getMaterials = async () => {
      if (startDate && endDate && selectedShifts.length > 0) {
        try {
          const data = await fetchMaterialList(startDate, endDate, selectedShifts);
          setMaterials(data);
          setError(null);
        } catch (err) {
          setError("Failed to fetch materials");
          console.error(err);
        }
      } else {
        setMaterials([]);
      }
    };
    getMaterials();
  }, [startDate, endDate, selectedShifts]);

  // Fetch operations
  useEffect(() => {
    const getOperations = async () => {
      if (material && selectedShifts.length > 0) {
        try {
          const data = await fetchOperationList(startDate, endDate, material, selectedShifts);
          setOperations(data);
          setError(null);
        } catch (err) {
          setError("Failed to fetch operations");
          console.error(err);
        }
      } else {
        setOperations([]);
      }
    };
    getOperations();
  }, [material, startDate, endDate, selectedShifts]);

  // Fetch gauges
  useEffect(() => {
    const getGauges = async () => {
      if (operation && selectedShifts.length > 0) {
        try {
          const data = await fetchGuageList(startDate, endDate, material, operation, selectedShifts);
          setGauges(data);
          setError(null);
        } catch (err) {
          setError("Failed to fetch gauges");
          console.error(err);
        }
      } else {
        setGauges([]);
      }
    };
    getGauges();
  }, [operation, material, startDate, endDate, selectedShifts]);

  return {
    shifts,
    materials,
    operations,
    gauges,
    error
  };
}