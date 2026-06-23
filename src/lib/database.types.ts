export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          announcement_id: string
          body: string
          created_at: string | null
          created_by: string
          institution_id: string
          org_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          announcement_id?: string
          body: string
          created_at?: string | null
          created_by: string
          institution_id: string
          org_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          announcement_id?: string
          body?: string
          created_at?: string | null
          created_by?: string
          institution_id?: string
          org_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "announcements_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["institution_id"]
          },
          {
            foreignKeyName: "announcements_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      categories: {
        Row: {
          category_id: string
          created_at: string | null
          created_by: string
          description: string
          institution_id: string
          name: string
        }
        Insert: {
          category_id?: string
          created_at?: string | null
          created_by: string
          description: string
          institution_id: string
          name: string
        }
        Update: {
          category_id?: string
          created_at?: string | null
          created_by?: string
          description?: string
          institution_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "categories_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["institution_id"]
          },
        ]
      }
      event_approvals: {
        Row: {
          approval_id: string
          approved_by: string | null
          event_id: string
          status: Database["public"]["Enums"]["status"]
          updated_at: string | null
        }
        Insert: {
          approval_id?: string
          approved_by?: string | null
          event_id: string
          status?: Database["public"]["Enums"]["status"]
          updated_at?: string | null
        }
        Update: {
          approval_id?: string
          approved_by?: string | null
          event_id?: string
          status?: Database["public"]["Enums"]["status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_approvals_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "event_approvals_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
        ]
      }
      event_attendance: {
        Row: {
          created_at: string | null
          event_attendance_id: string
          event_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_attendance_id?: string
          event_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_attendance_id?: string
          event_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendance_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_attendance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      event_categories: {
        Row: {
          category_id: string
          event_id: string
          institution_id: string
        }
        Insert: {
          category_id: string
          event_id: string
          institution_id: string
        }
        Update: {
          category_id?: string
          event_id?: string
          institution_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "event_categories_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_categories_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["institution_id"]
          },
        ]
      }
      event_comments: {
        Row: {
          comment: string
          created_at: string | null
          created_by: string
          event_comment_id: string
          event_id: string
          updated_at: string | null
        }
        Insert: {
          comment: string
          created_at?: string | null
          created_by: string
          event_comment_id?: string
          event_id: string
          updated_at?: string | null
        }
        Update: {
          comment?: string
          created_at?: string | null
          created_by?: string
          event_comment_id?: string
          event_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_comments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "event_comments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
        ]
      }
      event_invites: {
        Row: {
          created_at: string | null
          event_id: string
          institution_id: string
          invite_id: string
          invited_by: string
          invitee: string
          message: string | null
          status: Database["public"]["Enums"]["status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          event_id: string
          institution_id: string
          invite_id?: string
          invited_by: string
          invitee: string
          message?: string | null
          status: Database["public"]["Enums"]["status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string
          institution_id?: string
          invite_id?: string
          invited_by?: string
          invitee?: string
          message?: string | null
          status?: Database["public"]["Enums"]["status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_invites_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_invites_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["institution_id"]
          },
          {
            foreignKeyName: "event_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "event_invites_invitee_fkey"
            columns: ["invitee"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      event_media_links: {
        Row: {
          event_id: string
          media_asset_id: string
        }
        Insert: {
          event_id: string
          media_asset_id?: string
        }
        Update: {
          event_id?: string
          media_asset_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_media_links_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_media_links_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["media_asset_id"]
          },
        ]
      }
      event_subcategories: {
        Row: {
          event_id: string
          institution_id: string
          subcategory_id: string
        }
        Insert: {
          event_id: string
          institution_id: string
          subcategory_id: string
        }
        Update: {
          event_id?: string
          institution_id?: string
          subcategory_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_subcategories_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_subcategories_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["institution_id"]
          },
          {
            foreignKeyName: "event_subcategories_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["subcategory_id"]
          },
        ]
      }
      event_tags: {
        Row: {
          created_at: string | null
          event_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          tag_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_tags_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["tag_id"]
          },
        ]
      }
      events: {
        Row: {
          address: string | null
          created_by: string
          description: string
          end_date: string
          event_id: string
          image_url: string
          institution_id: string
          latitude: number
          longitude: number
          organization_id: string
          start_date: string
          status: Database["public"]["Enums"]["event_status"]
          title: string
          updated_at: string | null
          visibility_level: Database["public"]["Enums"]["visibility_level"]
        }
        Insert: {
          address?: string | null
          created_by: string
          description: string
          end_date: string
          event_id?: string
          image_url: string
          institution_id: string
          latitude: number
          longitude: number
          organization_id: string
          start_date: string
          status: Database["public"]["Enums"]["event_status"]
          title: string
          updated_at?: string | null
          visibility_level: Database["public"]["Enums"]["visibility_level"]
        }
        Update: {
          address?: string | null
          created_by?: string
          description?: string
          end_date?: string
          event_id?: string
          image_url?: string
          institution_id?: string
          latitude?: number
          longitude?: number
          organization_id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["event_status"]
          title?: string
          updated_at?: string | null
          visibility_level?: Database["public"]["Enums"]["visibility_level"]
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "events_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["institution_id"]
          },
          {
            foreignKeyName: "events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      friend_requests: {
        Row: {
          created_at: string | null
          receiver_id: string
          requester_id: string
          status: Database["public"]["Enums"]["friend_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          receiver_id: string
          requester_id: string
          status: Database["public"]["Enums"]["friend_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          receiver_id?: string
          requester_id?: string
          status?: Database["public"]["Enums"]["friend_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friend_requests_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "friend_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      institution_domains: {
        Row: {
          created_at: string | null
          domain: string
          institution_domain_id: string
          institution_id: string
          type_category: Database["public"]["Enums"]["domain_type"]
        }
        Insert: {
          created_at?: string | null
          domain: string
          institution_domain_id?: string
          institution_id: string
          type_category: Database["public"]["Enums"]["domain_type"]
        }
        Update: {
          created_at?: string | null
          domain?: string
          institution_domain_id?: string
          institution_id?: string
          type_category?: Database["public"]["Enums"]["domain_type"]
        }
        Relationships: [
          {
            foreignKeyName: "institution_domains_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["institution_id"]
          },
        ]
      }
      institution_requests: {
        Row: {
          created_at: string | null
          director_email: string | null
          email_domain: string | null
          note: string | null
          request_id: string
          requested_by: string
          status: string
          updated_at: string | null
          user_email: string
        }
        Insert: {
          created_at?: string | null
          director_email?: string | null
          email_domain?: string | null
          note?: string | null
          request_id?: string
          requested_by: string
          status?: string
          updated_at?: string | null
          user_email: string
        }
        Update: {
          created_at?: string | null
          director_email?: string | null
          email_domain?: string | null
          note?: string | null
          request_id?: string
          requested_by?: string
          status?: string
          updated_at?: string | null
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "institution_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      institutions: {
        Row: {
          abbreviated_name: string
          address: string | null
          created_at: string | null
          institution_id: string
          institution_name: string
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          primary_color: string | null
          secondary_color: string | null
          updated_at: string | null
        }
        Insert: {
          abbreviated_name: string
          address?: string | null
          created_at?: string | null
          institution_id?: string
          institution_name: string
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string | null
        }
        Update: {
          abbreviated_name?: string
          address?: string | null
          created_at?: string | null
          institution_id?: string
          institution_name?: string
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          asset_type: string
          created_at: string | null
          institution_id: string
          media_asset_id: string
          url: string
          user_id: string
          visibility_scope: Database["public"]["Enums"]["visibility_level"]
        }
        Insert: {
          asset_type: string
          created_at?: string | null
          institution_id: string
          media_asset_id?: string
          url: string
          user_id: string
          visibility_scope: Database["public"]["Enums"]["visibility_level"]
        }
        Update: {
          asset_type?: string
          created_at?: string | null
          institution_id?: string
          media_asset_id?: string
          url?: string
          user_id?: string
          visibility_scope?: Database["public"]["Enums"]["visibility_level"]
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["institution_id"]
          },
          {
            foreignKeyName: "media_assets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      org_approvals: {
        Row: {
          approval_id: string
          approved_by: string | null
          created_at: string | null
          org_id: string | null
          reviewed_at: string | null
          status: Database["public"]["Enums"]["status"] | null
        }
        Insert: {
          approval_id: string
          approved_by?: string | null
          created_at?: string | null
          org_id?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["status"] | null
        }
        Update: {
          approval_id?: string
          approved_by?: string | null
          created_at?: string | null
          org_id?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "org_approvals_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "org_approvals_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      org_invites: {
        Row: {
          created_at: string | null
          institution_id: string
          invite_id: string
          invited_by: string
          invitee: string
          message: string | null
          org_id: string
          status: Database["public"]["Enums"]["status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          institution_id: string
          invite_id?: string
          invited_by: string
          invitee: string
          message?: string | null
          org_id: string
          status: Database["public"]["Enums"]["status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          institution_id?: string
          invite_id?: string
          invited_by?: string
          invitee?: string
          message?: string | null
          org_id?: string
          status?: Database["public"]["Enums"]["status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "org_invites_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["institution_id"]
          },
          {
            foreignKeyName: "org_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "org_invites_invitee_fkey"
            columns: ["invitee"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "org_invites_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      org_media_links: {
        Row: {
          media_asset_id: string
          org_id: string
        }
        Insert: {
          media_asset_id?: string
          org_id: string
        }
        Update: {
          media_asset_id?: string
          org_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_media_links_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["media_asset_id"]
          },
          {
            foreignKeyName: "org_media_links_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      org_members: {
        Row: {
          created_at: string | null
          is_executive: boolean | null
          org_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          is_executive?: boolean | null
          org_id: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          is_executive?: boolean | null
          org_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organizations: {
        Row: {
          approved_by: string
          created_at: string | null
          created_by: string
          description: string
          institution_id: string
          logo_url: string | null
          name: string
          organization_id: string
          organization_type: Database["public"]["Enums"]["org_type"]
          status: Database["public"]["Enums"]["event_status"] | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          approved_by: string
          created_at?: string | null
          created_by: string
          description: string
          institution_id: string
          logo_url?: string | null
          name: string
          organization_id?: string
          organization_type: Database["public"]["Enums"]["org_type"]
          status?: Database["public"]["Enums"]["event_status"] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          approved_by?: string
          created_at?: string | null
          created_by?: string
          description?: string
          institution_id?: string
          logo_url?: string | null
          name?: string
          organization_id?: string
          organization_type?: Database["public"]["Enums"]["org_type"]
          status?: Database["public"]["Enums"]["event_status"] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "organizations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "organizations_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["institution_id"]
          },
          {
            foreignKeyName: "organizations_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string | null
          institution_id: string
          reason: string
          report_id: string
          reported_by: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          institution_id: string
          reason: string
          report_id?: string
          reported_by?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          institution_id?: string
          reason?: string
          report_id?: string
          reported_by?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["institution_id"]
          },
          {
            foreignKeyName: "reports_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string
          institution_id: string
          role_id: string
          role_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          institution_id: string
          role_id?: string
          role_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          institution_id?: string
          role_id?: string
          role_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roles_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["institution_id"]
          },
        ]
      }
      subcategories: {
        Row: {
          category_id: string
          created_at: string | null
          created_by: string
          description: string
          institution_id: string
          name: string
          subcategory_id: string
        }
        Insert: {
          category_id: string
          created_at?: string | null
          created_by: string
          description: string
          institution_id: string
          name: string
          subcategory_id?: string
        }
        Update: {
          category_id?: string
          created_at?: string | null
          created_by?: string
          description?: string
          institution_id?: string
          name?: string
          subcategory_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "subcategories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "subcategories_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["institution_id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string | null
          institution_id: string | null
          name: string
          tag_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          institution_id?: string | null
          name: string
          tag_id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          institution_id?: string | null
          name?: string
          tag_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tags_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["institution_id"]
          },
        ]
      }
      user_event_favorites: {
        Row: {
          created_at: string | null
          event_id: string
          favorite_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          favorite_id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          favorite_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_event_favorites_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "user_event_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_google_tokens: {
        Row: {
          user_id: string
          access_token: string | null
          refresh_token: string | null
          scope: string | null
          token_type: string | null
          expiry_date: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          user_id: string
          access_token?: string | null
          refresh_token?: string | null
          scope?: string | null
          token_type?: string | null
          expiry_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          user_id?: string
          access_token?: string | null
          refresh_token?: string | null
          scope?: string | null
          token_type?: string | null
          expiry_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_google_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          role_id: string
          user_id: string
          user_role_id: string
        }
        Insert: {
          created_at?: string | null
          role_id: string
          user_id: string
          user_role_id?: string
        }
        Update: {
          created_at?: string | null
          role_id?: string
          user_id?: string
          user_role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["role_id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          about: string | null
          avatar_url: string
          email: string | null
          first_name: string | null
          institution_id: string | null
          last_name: string | null
          onboarding: boolean
          role_id: string | null
          user_id: string
          username: string
          website_url: string | null
        }
        Insert: {
          about?: string | null
          avatar_url?: string
          email?: string | null
          first_name?: string | null
          institution_id?: string | null
          last_name?: string | null
          onboarding?: boolean
          role_id?: string | null
          user_id?: string
          username?: string
          website_url?: string | null
        }
        Update: {
          about?: string | null
          avatar_url?: string
          email?: string | null
          first_name?: string | null
          institution_id?: string | null
          last_name?: string | null
          onboarding?: boolean
          role_id?: string | null
          user_id?: string
          username?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["institution_id"]
          },
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["role_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auth_customize_jwt: {
        Args: { payload: Json }
        Returns: Json
      }
      complete_user_onboarding: {
        Args: {
          p_first: string
          p_last: string
          p_about: string
          p_avatar: string
          p_role: string
        }
        Returns: undefined
      }
      create_institution_and_admin: {
        Args: {
          p_name: string
          p_abbr: string
          p_address: string
          p_domain: string
          p_domain_type: string
        }
        Returns: string
      }
      event_attendance_counts: {
        Args: { ids: string[] }
        Returns: {
          event_id: string
          count: number
        }[]
      }
      get_user_institution: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_admin_role: {
        Args: Record<PropertyKey, never>
        Returns: {
          has_role: boolean
        }[]
      }
      has_role: {
        Args: { user_id: string; role_name: string }
        Returns: boolean
      }
      is_oy_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      domain_type: "Student" | "faculty"
      event_status: "draft" | "pending" | "approved" | "rejected"
      friend_status: "sent" | "accepted" | "blocked"
      org_type: "club" | "group"
      status: "draft" | "rejected" | "accepted" | "pending"
      visibility_level: "public" | "friend" | "group"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      domain_type: ["Student", "faculty"],
      event_status: ["draft", "pending", "approved", "rejected"],
      friend_status: ["sent", "accepted", "blocked"],
      org_type: ["club", "group"],
      status: ["draft", "rejected", "accepted", "pending"],
      visibility_level: ["public", "friend", "group"],
    },
  },
} as const
