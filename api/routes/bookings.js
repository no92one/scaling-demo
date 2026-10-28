import pool from "../db.js";

const list =  []

export default function bookings(server, path) {
  path += "/bookings";

  server.get(path, async (request, response) => {
    try {
      const result = await pool.query(`
        SELECT *
        FROM bookings
        ORDER BY id;
        `);

      return response.status(200).json(result.rows);

    } catch (error) {
      console.log(error);

      return response.status(500).json({
        message: "Server error."
      });
    }
  });

  server.post(path, async (request, response) => {
    try {
      const { name, email, date_time, number_of_people } = request.body;

      if (!name || !email || !date_time || !number_of_people) {
        return response.status(400).json({
          message: "Invalid request."
        });
      }

      const result = await pool.query(`
        INSERT INTO bookings (
          name,
          email,
          date_time,
          number_of_people
          )
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `, [name, email, date_time, number_of_people]);

      return response.status(201).json(result.rows[0]);

    } catch (error) {
      console.log(error);

      return response.status(500).json({
        message: "Server error."
      });
    }
  });
}