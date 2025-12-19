from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from backend.app.user.models.user import User
from backend.app.user.schemas.user import UserCreate, UserUpdate


class UserService:
    """Service for user operations."""
    
    @staticmethod
    def create_user(db: Session, user: UserCreate) -> User:
        """Create a new user."""
        db_user = User(**user.model_dump())
        db.add(db_user)
        try:
            db.commit()
            db.refresh(db_user)
            return db_user
        except IntegrityError:
            db.rollback()
            raise ValueError("User with this email or employee ID already exists")
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> User | None:
        """Get user by ID."""
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> User | None:
        """Get user by email."""
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def get_user_by_employee_id(db: Session, employee_id: str) -> User | None:
        """Get user by employee ID."""
        return db.query(User).filter(User.employee_id == employee_id).first()
    
    @staticmethod
    def get_all_users(db: Session, skip: int = 0, limit: int = 100) -> list[User]:
        """Get all users."""
        return db.query(User).offset(skip).limit(limit).all()
    
    @staticmethod
    def update_user(db: Session, user_id: int, user_update: UserUpdate) -> User | None:
        """Update user."""
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            return None
        
        update_data = user_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def delete_user(db: Session, user_id: int) -> bool:
        """Delete user."""
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            return False
        
        db.delete(db_user)
        db.commit()
        return True
