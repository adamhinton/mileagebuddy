export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      electricVehicleData: {
        Row: {
          costPerCharge: number
          createdAt: string | null
          deletedAt: string | null
          electricRangeMiles: number
          id: number
          milesPerCharge: number
          updatedAt: string | null
          vehicleID: number
        }
        Insert: {
          costPerCharge: number
          createdAt?: string | null
          deletedAt?: string | null
          electricRangeMiles: number
          id?: number
          milesPerCharge: number
          updatedAt?: string | null
          vehicleID: number
        }
        Update: {
          costPerCharge?: number
          createdAt?: string | null
          deletedAt?: string | null
          electricRangeMiles?: number
          id?: number
          milesPerCharge?: number
          updatedAt?: string | null
          vehicleID?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicle"
            columns: ["vehicleID"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      fixedCosts: {
        Row: {
          createdAt: string | null
          deletedAt: string | null
          id: number
          inspectionCost: number | null
          monthlyLoanPayment: number | null
          monthlyWarrantyCost: number | null
          otherYearlyCosts: number | null
          updatedAt: string | null
          vehicleID: number
          yearlyInsuranceCost: number | null
          yearlyRegistrationCost: number | null
          yearlyTaxes: number | null
        }
        Insert: {
          createdAt?: string | null
          deletedAt?: string | null
          id?: number
          inspectionCost?: number | null
          monthlyLoanPayment?: number | null
          monthlyWarrantyCost?: number | null
          otherYearlyCosts?: number | null
          updatedAt?: string | null
          vehicleID: number
          yearlyInsuranceCost?: number | null
          yearlyRegistrationCost?: number | null
          yearlyTaxes?: number | null
        }
        Update: {
          createdAt?: string | null
          deletedAt?: string | null
          id?: number
          inspectionCost?: number | null
          monthlyLoanPayment?: number | null
          monthlyWarrantyCost?: number | null
          otherYearlyCosts?: number | null
          updatedAt?: string | null
          vehicleID?: number
          yearlyInsuranceCost?: number | null
          yearlyRegistrationCost?: number | null
          yearlyTaxes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicle"
            columns: ["vehicleID"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      gasVehicleData: {
        Row: {
          createdAt: string | null
          deletedAt: string | null
          gasCostPerGallon: number
          id: number
          milesPerGallonCity: number
          milesPerGallonHighway: number
          updatedAt: string | null
          vehicleID: number
        }
        Insert: {
          createdAt?: string | null
          deletedAt?: string | null
          gasCostPerGallon: number
          id?: number
          milesPerGallonCity: number
          milesPerGallonHighway: number
          updatedAt?: string | null
          vehicleID: number
        }
        Update: {
          createdAt?: string | null
          deletedAt?: string | null
          gasCostPerGallon?: number
          id?: number
          milesPerGallonCity?: number
          milesPerGallonHighway?: number
          updatedAt?: string | null
          vehicleID?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicle"
            columns: ["vehicleID"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      hybridVehicleData: {
        Row: {
          createdAt: string | null
          deletedAt: string | null
          electricityCostPerKWh: number
          gasCostPerGallon: number
          id: number
          milesPerGallonCity: number
          milesPerGallonHighway: number
          milesPerKWhCity: number
          milesPerKWhHighway: number
          percentElectricDriving: number
          updatedAt: string | null
          vehicleID: number
        }
        Insert: {
          createdAt?: string | null
          deletedAt?: string | null
          electricityCostPerKWh: number
          gasCostPerGallon: number
          id?: number
          milesPerGallonCity: number
          milesPerGallonHighway: number
          milesPerKWhCity: number
          milesPerKWhHighway: number
          percentElectricDriving: number
          updatedAt?: string | null
          vehicleID: number
        }
        Update: {
          createdAt?: string | null
          deletedAt?: string | null
          electricityCostPerKWh?: number
          gasCostPerGallon?: number
          id?: number
          milesPerGallonCity?: number
          milesPerGallonHighway?: number
          milesPerKWhCity?: number
          milesPerKWhHighway?: number
          percentElectricDriving?: number
          updatedAt?: string | null
          vehicleID?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicle"
            columns: ["vehicleID"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      purchaseAndSales: {
        Row: {
          createdAt: string | null
          deletedAt: string | null
          downPaymentAmount: number | null
          id: number
          milesBoughtAt: number
          purchasePrice: number
          updatedAt: string | null
          vehicleID: number
          willSellCarAfterYears: number
          willSellCarAtMiles: number
          willSellCarAtPrice: number
          yearPurchased: number | null
        }
        Insert: {
          createdAt?: string | null
          deletedAt?: string | null
          downPaymentAmount?: number | null
          id?: number
          milesBoughtAt: number
          purchasePrice: number
          updatedAt?: string | null
          vehicleID: number
          willSellCarAfterYears: number
          willSellCarAtMiles: number
          willSellCarAtPrice: number
          yearPurchased?: number | null
        }
        Update: {
          createdAt?: string | null
          deletedAt?: string | null
          downPaymentAmount?: number | null
          id?: number
          milesBoughtAt?: number
          purchasePrice?: number
          updatedAt?: string | null
          vehicleID?: number
          willSellCarAfterYears?: number
          willSellCarAtMiles?: number
          willSellCarAtPrice?: number
          yearPurchased?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicle"
            columns: ["vehicleID"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      usage: {
        Row: {
          averageDailyMiles: number
          createdAt: string | null
          deletedAt: string | null
          extraDistanceMiles: number | null
          extraDistancePercentHighway: number | null
          id: number
          percentHighway: number
          updatedAt: string | null
          vehicleID: number
          weeksPerYear: number
        }
        Insert: {
          averageDailyMiles: number
          createdAt?: string | null
          deletedAt?: string | null
          extraDistanceMiles?: number | null
          extraDistancePercentHighway?: number | null
          id?: number
          percentHighway: number
          updatedAt?: string | null
          vehicleID: number
          weeksPerYear: number
        }
        Update: {
          averageDailyMiles?: number
          createdAt?: string | null
          deletedAt?: string | null
          extraDistanceMiles?: number | null
          extraDistancePercentHighway?: number | null
          id?: number
          percentHighway?: number
          updatedAt?: string | null
          vehicleID?: number
          weeksPerYear?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicle"
            columns: ["vehicleID"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      variableCosts: {
        Row: {
          createdAt: string | null
          deletedAt: string | null
          id: number
          monthlyCarWashCost: number | null
          monthlyCostDeductions: number | null
          monthlyMiscellaneousCosts: number | null
          monthlyParkingCosts: number | null
          monthlyTolls: number | null
          updatedAt: string | null
          vehicleID: number
        }
        Insert: {
          createdAt?: string | null
          deletedAt?: string | null
          id?: number
          monthlyCarWashCost?: number | null
          monthlyCostDeductions?: number | null
          monthlyMiscellaneousCosts?: number | null
          monthlyParkingCosts?: number | null
          monthlyTolls?: number | null
          updatedAt?: string | null
          vehicleID: number
        }
        Update: {
          createdAt?: string | null
          deletedAt?: string | null
          id?: number
          monthlyCarWashCost?: number | null
          monthlyCostDeductions?: number | null
          monthlyMiscellaneousCosts?: number | null
          monthlyParkingCosts?: number | null
          monthlyTolls?: number | null
          updatedAt?: string | null
          vehicleID?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicle"
            columns: ["vehicleID"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicleData: {
        Row: {
          createdAt: string | null
          deletedAt: string | null
          highwayMPG: number
          id: number
          make: string | null
          model: string | null
          trim: string | null
          updatedAt: string | null
          vehicleID: number
          vehicleName: string
          year: number | null
        }
        Insert: {
          createdAt?: string | null
          deletedAt?: string | null
          highwayMPG: number
          id?: number
          make?: string | null
          model?: string | null
          trim?: string | null
          updatedAt?: string | null
          vehicleID: number
          vehicleName: string
          year?: number | null
        }
        Update: {
          createdAt?: string | null
          deletedAt?: string | null
          highwayMPG?: number
          id?: number
          make?: string | null
          model?: string | null
          trim?: string | null
          updatedAt?: string | null
          vehicleID?: number
          vehicleName?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicle"
            columns: ["vehicleID"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          createdAt: string | null
          deletedAt: string | null
          id: number
          type: string
          updatedAt: string | null
          userid: string
          vehiclesOrder: number
        }
        Insert: {
          createdAt?: string | null
          deletedAt?: string | null
          id?: number
          type: string
          updatedAt?: string | null
          userid: string
          vehiclesOrder: number
        }
        Update: {
          createdAt?: string | null
          deletedAt?: string | null
          id?: number
          type?: string
          updatedAt?: string | null
          userid?: string
          vehiclesOrder?: number
        }
        Relationships: []
      }
      yearlyMaintenanceCosts: {
        Row: {
          batteries: number | null
          brakes: number | null
          createdAt: string | null
          deletedAt: string | null
          id: number
          oilChanges: number | null
          other: number | null
          tires: number | null
          updatedAt: string | null
          vehicleID: number
        }
        Insert: {
          batteries?: number | null
          brakes?: number | null
          createdAt?: string | null
          deletedAt?: string | null
          id?: number
          oilChanges?: number | null
          other?: number | null
          tires?: number | null
          updatedAt?: string | null
          vehicleID: number
        }
        Update: {
          batteries?: number | null
          brakes?: number | null
          createdAt?: string | null
          deletedAt?: string | null
          id?: number
          oilChanges?: number | null
          other?: number | null
          tires?: number | null
          updatedAt?: string | null
          vehicleID?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicle"
            columns: ["vehicleID"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      insert_vehicle: {
        Args: {
          _userid: string
          _type: string
          _vehiclesorder: number
          _vehicledata: Json
          _gasvehicledata: Json
          _electricvehicledata: Json
          _hybridvehicledata: Json
          _purchaseandsales: Json
          _usage: Json
          _fixedcosts: Json
          _yearlymaintenancecosts: Json
          _variablecosts: Json
        }
        Returns: number
      }
      update_vehicle: {
        Args: {
          _vehicleid: number
          _partialdata: Json
        }
        Returns: undefined
      }
      update_vehicles_order: {
        Args: {
          _userid: string
          _vehicle_orders: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

