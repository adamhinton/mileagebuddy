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
      users: {
        Row: {
          email: string
          id: number
          isDarkMode: boolean | null
        }
        Insert: {
          email: string
          id?: never
          isDarkMode?: boolean | null
        }
        Update: {
          email?: string
          id?: never
          isDarkMode?: boolean | null
        }
        Relationships: []
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
          userid: number
          vehiclesOrder: number
        }
        Insert: {
          createdAt?: string | null
          deletedAt?: string | null
          id?: number
          type: string
          updatedAt?: string | null
          userid: number
          vehiclesOrder: number
        }
        Update: {
          createdAt?: string | null
          deletedAt?: string | null
          id?: number
          type?: string
          updatedAt?: string | null
          userid?: number
          vehiclesOrder?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_user"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      yearlyMaintenanceCosts: {
        Row: {
          batteries: number | null
          brakes: number | null
          createdAt: string | null
          deletedAt: string | null
          depreciation: number | null
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
          depreciation?: number | null
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
          depreciation?: number | null
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
          _userid: number
          _type: string
          _vehiclesorder: number
          _vehicledata: Json
          _gasvehicledata: Json
          _electricvehicledata: Json
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
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

