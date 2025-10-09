-- Test Seed Data for Employee Directory
-- Generates 10,000 employee records for fast test execution
-- Includes guaranteed "John Smith" records for predictable testing

DO $$
DECLARE
    first_names TEXT[] := ARRAY[
        'John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily', 
        'William', 'Jessica', 'James', 'Ashley', 'Christopher', 'Amanda', 'Daniel', 
        'Jennifer', 'Matthew', 'Stephanie', 'Anthony', 'Nicole', 'Mark', 'Elizabeth',
        'Donald', 'Helen', 'Steven', 'Deborah', 'Paul', 'Rachel', 'Andrew', 'Carolyn'
    ];
    last_names TEXT[] := ARRAY[
        'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
        'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
        'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
        'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
    ];
    departments TEXT[] := ARRAY[
        'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 
        'Customer Service', 'IT', 'Legal', 'Product', 'Design', 'Quality Assurance'
    ];
    i INTEGER;
BEGIN
    -- First, insert guaranteed "John Smith" records for testing
    FOR i IN 1..10 LOOP
        INSERT INTO employees (first_name, last_name, department, email, created_at)
        VALUES (
            'John',
            'Smith',
            departments[1 + (random() * (array_length(departments, 1) - 1))::INTEGER],
            'john.smith' || i || '@company.com',
            CURRENT_TIMESTAMP - (random() * INTERVAL '365 days')
        );
    END LOOP;

    -- Generate remaining random employee records
    FOR i IN 11..10000 LOOP
        INSERT INTO employees (first_name, last_name, department, email, created_at)
        VALUES (
            first_names[1 + (random() * (array_length(first_names, 1) - 1))::INTEGER],
            last_names[1 + (random() * (array_length(last_names, 1) - 1))::INTEGER],
            departments[1 + (random() * (array_length(departments, 1) - 1))::INTEGER],
            'employee' || i || '@company.com',
            CURRENT_TIMESTAMP - (random() * INTERVAL '365 days')
        );
    END LOOP;
END $$;