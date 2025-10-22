import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { storagePut, storageGet } from "./storage";
import { createDataset, getDatasets, getDatasetById, deleteDataset, createDashboard, getDashboards, getDashboardById, updateDashboard, deleteDashboard } from "./db";
import { TRPCError } from "@trpc/server";
import Papa from "papaparse";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  dataset: router({
    /**
     * Upload CSV file and create dataset
     */
    upload: protectedProcedure
      .input(z.object({
        fileName: z.string(),
        fileContent: z.string(),
        name: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          // Parse CSV
          const parsed = Papa.parse(input.fileContent, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: false,
          });

          if (!parsed.data || parsed.data.length === 0) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "CSV file is empty or invalid",
            });
          }

          const columns = Object.keys(parsed.data[0] as Record<string, unknown>);
          const rowCount = parsed.data.length;

          // Upload to S3
          const storageKey = `datasets/${ctx.user.id}/${Date.now()}-${input.fileName}`;
          const { url } = await storagePut(
            storageKey,
            input.fileContent,
            "text/csv"
          );

          // Create dataset record
          const result = await createDataset({
            userId: ctx.user.id,
            name: input.name,
            description: input.description,
            fileName: input.fileName,
            storageKey,
            columns,
            rowCount,
          });

          return {
            success: true,
            message: "Dataset uploaded successfully",
            columns,
            rowCount,
          };
        } catch (error) {
          console.error("Upload error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to upload dataset",
          });
        }
      }),

    /**
     * Get all datasets for current user
     */
    list: protectedProcedure.query(async ({ ctx }) => {
      const userDatasets = await getDatasets(ctx.user.id);
      return userDatasets;
    }),

    /**
     * Get dataset by ID with data
     */
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const dataset = await getDatasetById(input.id);
        
        if (!dataset) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Dataset not found",
          });
        }

        if (dataset.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have access to this dataset",
          });
        }

        // Get CSV data from S3
        const { url: downloadUrl } = await storageGet(dataset.storageKey);
        
        return {
          ...dataset,
          downloadUrl,
        };
      }),

    /**
     * Delete dataset
     */
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const dataset = await getDatasetById(input.id);
        
        if (!dataset) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Dataset not found",
          });
        }

        if (dataset.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have access to this dataset",
          });
        }

        await deleteDataset(input.id);
        return { success: true };
      }),
  }),

  dashboard: router({
    /**
     * Create new dashboard
     */
    create: protectedProcedure
      .input(z.object({
        datasetId: z.number(),
        name: z.string(),
        description: z.string().optional(),
        config: z.any(),
      }))
      .mutation(async ({ input, ctx }) => {
        const dataset = await getDatasetById(input.datasetId);
        
        if (!dataset) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Dataset not found",
          });
        }

        if (dataset.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have access to this dataset",
          });
        }

        await createDashboard({
          userId: ctx.user.id,
          datasetId: input.datasetId,
          name: input.name,
          description: input.description,
          config: input.config,
        });

        return { success: true, message: "Dashboard created successfully" };
      }),

    /**
     * Get all dashboards for current user
     */
    list: protectedProcedure.query(async ({ ctx }) => {
      const userDashboards = await getDashboards(ctx.user.id);
      return userDashboards;
    }),

    /**
     * Get dashboard by ID
     */
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const dashboard = await getDashboardById(input.id);
        
        if (!dashboard) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Dashboard not found",
          });
        }

        if (dashboard.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have access to this dashboard",
          });
        }

        const dataset = await getDatasetById(dashboard.datasetId);
        
        return {
          ...dashboard,
          dataset,
        };
      }),

    /**
     * Update dashboard configuration
     */
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        config: z.any(),
      }))
      .mutation(async ({ input, ctx }) => {
        const dashboard = await getDashboardById(input.id);
        
        if (!dashboard) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Dashboard not found",
          });
        }

        if (dashboard.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have access to this dashboard",
          });
        }

        await updateDashboard(input.id, input.config);
        return { success: true };
      }),

    /**
     * Delete dashboard
     */
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const dashboard = await getDashboardById(input.id);
        
        if (!dashboard) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Dashboard not found",
          });
        }

        if (dashboard.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have access to this dashboard",
          });
        }

        await deleteDashboard(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;

