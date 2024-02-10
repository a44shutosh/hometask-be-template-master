const { Contract, Profile, Job, sequelize } = require("../models/model");
const { Op } = require("sequelize");

/**
 * GET /admin/best-profession?start=<date>&end=<date>
 * - Returns the profession that earned the most money (sum of jobs paid) for any contactor
 *  that worked in the query time range.
 */
const getBestProfession = async (start, end) => {
  try {
    const result = await sequelize.query(
      `
      SELECT 
        "Profile"."profession" as "profession",
        SUM("Jobs"."price") as "totalPaid"
      FROM "Contracts" AS "Contract"
      LEFT JOIN "Jobs" AS "Jobs" ON "Contract"."id" = "Jobs"."ContractId"
      LEFT JOIN "Profiles" AS "Profile" ON "Contract"."ContractorId" = "Profile"."id"
      WHERE 
        "Contract"."status" != 'terminated' AND
        "Jobs"."paid" = true AND
        "Jobs"."paymentDate" BETWEEN :start AND :end
      GROUP BY "Profile"."profession"
      ORDER BY SUM("Jobs"."price") DESC
      `,
      {
        replacements: { start: new Date(start), end: new Date(end) },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    return result[0];
  } catch (error) {
    console.error("Error getting best profession:", error);
    throw error;
  }
};

const getBestClients = async (start, end, limit = 2) => {
  try {
    const result = await sequelize.query(
      `
      SELECT 
        "Client"."id" as "id",
        "Client"."firstName" || ' ' || "Client"."lastName" as "name",
        SUM("Jobs"."price") as "totalPaid"
      FROM "Contracts" AS "Contract"
      LEFT JOIN "Jobs" AS "Jobs" ON "Contract"."id" = "Jobs"."ContractId"
      LEFT JOIN "Profiles" AS "Client" ON "Contract"."ClientId" = "Client"."id"
      WHERE 
        "Contract"."status" != 'terminated' AND
        "Jobs"."paid" = true AND
        "Jobs"."paymentDate" BETWEEN :start AND :end
      GROUP BY "Client"."id"
      ORDER BY SUM("Jobs"."price") DESC
      LIMIT :limit
      `,
      {
        replacements: { start: new Date(start), end: new Date(end), limit },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    return result;
  } catch (error) {
    console.error("Error getting best clients:", error);
    throw error;
  }
};

module.exports = {
  getBestProfession,
  getBestClients,
};
