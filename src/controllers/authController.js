const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

// Google Login (Fan)
exports.googleLogin = async (req, res) => {
  try {
    const { idToken, name, email, googleId, avatarUrl } = req.body;

    // In production, verify idToken with Firebase Admin SDK
    // For now, we'll trust the frontend verification

    // Check if user exists
    let result = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);

    let user;
    if (result.rows.length === 0) {
      // Create new user
      result = await pool.query(
        `INSERT INTO users (email, name, avatar_url, google_id, leaderboard_points, current_streak, created_at)
         VALUES ($1, $2, $3, $4, 0, 0, NOW())
         RETURNING *`,
        [email, name, avatarUrl, googleId]
      );
      user = result.rows[0];
    } else {
      user = result.rows[0];
    }

    const token = generateToken({ 
      userId: user.id, 
      email: user.email,
      userType: 'fan'
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        leaderboard_points: user.leaderboard_points,
        current_streak: user.current_streak,
      },
      userType: 'fan',
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ error: 'Failed to login with Google' });
  }
};

// Player Login
exports.playerLogin = async (req, res) => {
  try {
    const { playerId, password } = req.body;

    // Get player from database
    const result = await pool.query('SELECT * FROM players WHERE player_id = $1', [playerId]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const player = result.rows[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, player.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ 
      playerId: player.id, 
      email: player.email,
      userType: 'player'
    });

    res.json({
      success: true,
      token,
      player: {
        id: player.id,
        player_id: player.player_id,
        name: player.name,
        role: player.role,
        team: player.team,
        email: player.email,
        avatar_url: player.avatar_url,
      },
      userType: 'player',
    });
  } catch (error) {
    console.error('Player login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

// Player Registration
exports.playerRegister = async (req, res) => {
  try {
    const { name, email, phone, role, team, password } = req.body;

    // Check if email exists
    const existingPlayer = await pool.query('SELECT * FROM players WHERE email = $1', [email]);
    if (existingPlayer.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate unique player ID
    const playerIdResult = await pool.query('SELECT COUNT(*) FROM players');
    const count = parseInt(playerIdResult.rows[0].count);
    const playerId = `PLR${String(count + 1).padStart(3, '0')}`;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create player
    const result = await pool.query(
      `INSERT INTO players (player_id, name, email, phone, role, team, password, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING *`,
      [playerId, name, email, phone, role, team, hashedPassword]
    );

    const player = result.rows[0];

    // TODO: Send email with player_id

    res.status(201).json({
      success: true,
      message: 'Player registered successfully',
      playerId: player.player_id,
    });
  } catch (error) {
    console.error('Player registration error:', error);
    res.status(500).json({ error: 'Failed to register player' });
  }
};

// Get Current User
exports.getMe = async (req, res) => {
  try {
    const { userId, playerId, userType } = req.user;

    if (userType === 'fan') {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
      const user = result.rows[0];

      return res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
          leaderboard_points: user.leaderboard_points,
          current_streak: user.current_streak,
        },
        userType: 'fan',
      });
    } else {
      const result = await pool.query('SELECT * FROM players WHERE id = $1', [playerId]);
      const player = result.rows[0];

      return res.json({
        success: true,
        user: {
          id: player.id,
          player_id: player.player_id,
          name: player.name,
          role: player.role,
          team: player.team,
          email: player.email,
          avatar_url: player.avatar_url,
        },
        userType: 'player',
      });
    }
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
};

// Logout
exports.logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};
