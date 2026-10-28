CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL,
  email varchar(100) NOT NULL,
  date_time TIMESTAMPTZ NOT NULL,
  number_of_people INTEGER NOT NULL
    CHECK (number_of_people > 0),
  status varchar(20) NOT NULL DEFAULT 'PENDING' 
    CHECK (
      status IN (
      'PENDING',
      'CONFIRMED',
      'CANCELLED'
    )
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP

)