import { pgClient } from "../config/db.js";

// creating booking

export const createBooking = async (req, res) => {
  const { carName, days, rentPerDay } = req.body;
  const { userId } = req.user;

  if (
    !carName ||
    !days ||
    !rentPerDay ||
    days >= 365 ||
    days <= 0 ||
    rentPerDay > 2000 ||
    rentPerDay <= 0
  ) {
    return res.status(400).json({
      success: false,
      error: "invalid inputs",
    });
  }

  try {
    const result = await pgClient.query(
      `INSERT INTO bookings (user_id, car_name, days, rent_per_day, status)
       VALUES ($1, $2, $3, $4, 'booked')
       RETURNING id`,
      [userId, carName, days, rentPerDay]
    );

    return res.status(201).json({
      success: true,
      data: {
        message: "Booking created successfully",
        bookingId: result.rows[0].id,
        totalCost: days * rentPerDay,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "server error",
    });
  }
};

// get booking

export const getBooking = async (req, res) => {
  const { id: bookingId } = req.params;
  const { summary } = req.query;
  const { userId, username } = req.user;

  try {
    // summary
    if (summary === "true") {
      const result = await pgClient.query(
        `SELECT COUNT(*)AS count,
                COALESCE(SUM(days *rent_per_day),0) AS total
                FROM bookings
                WHERE user_id = $1
                AND status IN('booked', 'completed')`,
        [userId]
      );

      return res.status(200).json({
        success: true,
        data: {
          userId,
          username,
          totalBookings: Number(result.rows[0].count),
          totalAmountSpent: Number(result.rows[0].total),
        },
      });
    }

    // single booking
    if (bookingId) {
      const result = await pgClient.query(
        `SELECT * FROM bookings WHERE id = $1 AND user_id = $2`,
        [bookingId, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Booking not found",
        });
      }

      const b = result.rows[0];
      return res.status(200).json({
        success: true,
        data: [
          {
            ...b,
            totalCost: b.days * b.rent_per_day,
          },
        ],
      });
    }

    // all bookings
    const result = await pgClient.query(
      `SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    const bookings = result.rows.map((b) => ({
      ...b,
      totalCost: b.days * b.rent_per_day,
    }));

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// updating booking

export const updateBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { carName, days, rentPerDay, status } = req.body;
  const { userId } = req.user;

  try {
    /*  Check booking exists */
    const existing = await pgClient.query(
      "SELECT * FROM bookings WHERE id = $1",
      [bookingId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "booking not found",
      });
    }

    const booking = existing.rows[0];

    /* Ownership check */
    if (booking.user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: "booking does not belong to user",
      });
    }

    /*  Validation */
    if (
      (days && (days <= 0 || days >= 365)) ||
      (rentPerDay && (rentPerDay <= 0 || rentPerDay > 2000)) ||
      (status && !["booked", "completed", "cancelled"].includes(status))
    ) {
      return res.status(400).json({
        success: false,
        error: "invalid inputs",
      });
    }

    /*  Update booking */
    const updated = await pgClient.query(
      `UPDATE bookings
       SET car_name = COALESCE($1, car_name),
           days = COALESCE($2, days),
           rent_per_day = COALESCE($3, rent_per_day),
           status = COALESCE($4, status)
       WHERE id = $5
       RETURNING *`,
      [carName, days, rentPerDay, status, bookingId]
    );

    const b = updated.rows[0];

    return res.status(200).json({
      success: true,
      data: {
        message: "Booking updated successfully",
        booking: {
          ...b,
          totalCost: b.days * b.rent_per_day,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "server error",
    });
  }
};

// DELETE BOOKING

export const deleteBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { userId } = req.user;

  try {
    const booking = await pgClient.query(
      "SELECT user_id FROM bookings WHERE id = $1",
      [bookingId]
    );

    if (booking.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    if (booking.rows[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
      });
    }

    await pgClient.query("DELETE FROM bookings WHERE id = $1", [bookingId]);

    res.status(200).json({
      success: true,
      data: { message: "Booking deleted successfully" },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};
