@app.post("/login", response_model=UserModel)
async def login_user(user: UserBase, db: Session = Depends(get_db)):
    # Log input username for debugging
    print(f"Attempting login for username: {user.username}")

    # Query the `registers` table for the username
    db_user = db.query(models.Register).filter(models.Register.username == user.username).first()

    # Check if the user exists in the `registers` table
    if not db_user:
        print("No user found with this username.")
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Validate the password
    if db_user.password != user.password:
        print("Invalid password entered.")
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # If both username and password are valid, return the user details
    print("Login successful!")
    db_user = models.User(
        username=user.username,
        password=user.password
    )   
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
