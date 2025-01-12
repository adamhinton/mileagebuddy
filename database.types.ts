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
      electricvehicledata: {
        Row: {
          costpercharge: number
          createdat: string | null
          deletedat: string | null
          electricrangemiles: number
          id: number
          milespercharge: number
          updatedat: string | null
          vehicleid: number
        }
        Insert: {
          costpercharge: number
          createdat?: string | null
          deletedat?: string | null
          electricrangemiles: number
          id?: number
          milespercharge: number
          updatedat?: string | null
          vehicleid: number
        }
        Update: {
          costpercharge?: number
          createdat?: string | null
          deletedat?: string | null
          electricrangemiles?: number
          id?: number
          milespercharge?: number
          updatedat?: string | null
          vehicleid?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicle"
            columns: ["vehicleid"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      fixedcosts: {
        Row: {
          createdat: string | null
          deletedat: string | null
          id: number
          inspectioncost: number | null
          monthlyloanpayment: number | null
          monthlywarrantycost: number | null
          otheryearlycosts: number | null
          updatedat: string | null
          vehicleid: number
          yearlyinsurancecost: number | null
          yearlyparkingcost: number | null
          yearlyregistrationcost: number | null
          yearlytaxes: number | null
        }
        Insert: {
          createdat?: string | null
          deletedat?: string | null
          id?: number
          inspectioncost?: number | null
          monthlyloanpayment?: number | null
          monthlywarrantycost?: number | null
          otheryearlycosts?: number | null
          updatedat?: string | null
          vehicleid: number
          yearlyinsurancecost?: number | null
          yearlyparkingcost?: number | null
          yearlyregistrationcost?: number | null
          yearlytaxes?: number | null
        }
        Update: {
          createdat?: string | null
          deletedat?: string | null
          id?: number
          inspectioncost?: number | null
          monthlyloanpayment?: number | null
          monthlywarrantycost?: number | null
          otheryearlycosts?: number | null
          updatedat?: string | null
          vehicleid?: number
          yearlyinsurancecost?: number | null
          yearlyparkingcost?: number | null
          yearlyregistrationcost?: number | null
          yearlytaxes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicle"
            columns: ["vehicleid"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      gasvehicledata: {
        Row: {
          createdat: string | null
          deletedat: string | null
          gascostpergallon: number
          id: number
          milespergalloncity: number
          milespergallonhighway: number
          updatedat: string | null
          vehicleid: number
        }
        Insert: {
          createdat?: string | null
          deletedat?: string | null
          gascostpergallon: number
          id?: number
          milespergalloncity: number
          milespergallonhighway: number
          updatedat?: string | null
          vehicleid: number
        }
        Update: {
          createdat?: string | null
          deletedat?: string | null
          gascostpergallon?: number
          id?: number
          milespergalloncity?: number
          milespergallonhighway?: number
          updatedat?: string | null
          vehicleid?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicle"
            columns: ["vehicleid"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      purchaseandsales: {
        Row: {
          createdat: string | null
          deletedat: string | null
          downpaymentamount: number | null
          id: number
          milesboughtat: number
          purchaseprice: number
          updatedat: string | null
          vehicleid: number
          willsellcarafteryears: number
          willsellcaratmiles: number
          willsellcaratprice: number
          yearpurchased: number | null
        }
        Insert: {
          createdat?: string | null
          deletedat?: string | null
          downpaymentamount?: number | null
          id?: number
          milesboughtat: number
          purchaseprice: number
          updatedat?: string | null
          vehicleid: number
          willsellcarafteryears: number
          willsellcaratmiles: number
          willsellcaratprice: number
          yearpurchased?: number | null
        }
        Update: {
          createdat?: string | null
          deletedat?: string | null
          downpaymentamount?: number | null
          id?: number
          milesboughtat?: number
          purchaseprice?: number
          updatedat?: string | null
          vehicleid?: number
          willsellcarafteryears?: number
          willsellcaratmiles?: number
          willsellcaratprice?: number
          yearpurchased?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicle"
            columns: ["vehicleid"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      usage: {
        Row: {
          averagedailymiles: number
          createdat: string | null
          deletedat: string | null
          extradistancemiles: number | null
          extradistancepercenthighway: number | null
          id: number
          percenthighway: number
          updatedat: string | null
          vehicleid: number
          weeksperyear: number
        }
        Insert: {
          averagedailymiles: number
          createdat?: string | null
          deletedat?: string | null
          extradistancemiles?: number | null
          extradistancepercenthighway?: number | null
          id?: number
          percenthighway: number
          updatedat?: string | null
          vehicleid: number
          weeksperyear: number
        }
        Update: {
          averagedailymiles?: number
          createdat?: string | null
          deletedat?: string | null
          extradistancemiles?: number | null
          extradistancepercenthighway?: number | null
          id?: number
          percenthighway?: number
          updatedat?: string | null
          vehicleid?: number
          weeksperyear?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicle"
            columns: ["vehicleid"]
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
          isdarkmode: boolean | null
        }
        Insert: {
          email: string
          id?: never
          isdarkmode?: boolean | null
        }
        Update: {
          email?: string
          id?: never
          isdarkmode?: boolean | null
        }
        Relationships: []
      }
      variablecosts: {
        Row: {
          createdat: string | null
          deletedat: string | null
          id: number
          monthlycarwashcost: number | null
          monthlycostdeductions: number | null
          monthlymiscellaneouscosts: number | null
          monthlyparkingcosts: number | null
          monthlytolls: number | null
          updatedat: string | null
          vehicleid: number
        }
        Insert: {
          createdat?: string | null
          deletedat?: string | null
          id?: number
          monthlycarwashcost?: number | null
          monthlycostdeductions?: number | null
          monthlymiscellaneouscosts?: number | null
          monthlyparkingcosts?: number | null
          monthlytolls?: number | null
          updatedat?: string | null
          vehicleid: number
        }
        Update: {
          createdat?: string | null
          deletedat?: string | null
          id?: number
          monthlycarwashcost?: number | null
          monthlycostdeductions?: number | null
          monthlymiscellaneouscosts?: number | null
          monthlyparkingcosts?: number | null
          monthlytolls?: number | null
          updatedat?: string | null
          vehicleid?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicle"
            columns: ["vehicleid"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicledata: {
        Row: {
          createdat: string | null
          deletedat: string | null
          highwaympg: number
          id: number
          make: string | null
          model: string | null
          trim: string | null
          updatedat: string | null
          vehicleid: number
          vehiclename: string
          year: number | null
        }
        Insert: {
          createdat?: string | null
          deletedat?: string | null
          highwaympg: number
          id?: number
          make?: string | null
          model?: string | null
          trim?: string | null
          updatedat?: string | null
          vehicleid: number
          vehiclename: string
          year?: number | null
        }
        Update: {
          createdat?: string | null
          deletedat?: string | null
          highwaympg?: number
          id?: number
          make?: string | null
          model?: string | null
          trim?: string | null
          updatedat?: string | null
          vehicleid?: number
          vehiclename?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicle"
            columns: ["vehicleid"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          createdat: string | null
          deletedat: string | null
          id: number
          type: string
          updatedat: string | null
          userid: number
        }
        Insert: {
          createdat?: string | null
          deletedat?: string | null
          id?: number
          type: string
          updatedat?: string | null
          userid: number
        }
        Update: {
          createdat?: string | null
          deletedat?: string | null
          id?: number
          type?: string
          updatedat?: string | null
          userid?: number
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
      yearlymaintenancecosts: {
        Row: {
          batteries: number | null
          brakes: number | null
          createdat: string | null
          deletedat: string | null
          depreciation: number | null
          id: number
          oilchanges: number | null
          other: number | null
          tires: number | null
          updatedat: string | null
          vehicleid: number
        }
        Insert: {
          batteries?: number | null
          brakes?: number | null
          createdat?: string | null
          deletedat?: string | null
          depreciation?: number | null
          id?: number
          oilchanges?: number | null
          other?: number | null
          tires?: number | null
          updatedat?: string | null
          vehicleid: number
        }
        Update: {
          batteries?: number | null
          brakes?: number | null
          createdat?: string | null
          deletedat?: string | null
          depreciation?: number | null
          id?: number
          oilchanges?: number | null
          other?: number | null
          tires?: number | null
          updatedat?: string | null
          vehicleid?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicle"
            columns: ["vehicleid"]
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
      [_ in never]: never
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

