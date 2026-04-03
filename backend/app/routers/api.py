# Made written by ali hasan
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models import get_db, Company, Post, Connection, Message, JobPosting, Event, Group, Review, User
from app.schemas import CompanyResponse, CompanyUpdate, PostCreate, PostResponse, ConnectionResponse, MessageCreate, MessageResponse
from app.schemas import JobPostingCreate, JobPostingResponse, JobPostingUpdate, EventCreate, EventResponse, EventUpdate
from app.schemas import GroupCreate, GroupResponse, GroupUpdate, ReviewCreate, ReviewResponse, ReviewUpdate
from app.schemas import NotificationResponse, BadgeResponse, CompanyBadgeResponse, AdminStats, SearchQuery
from app.models import Notification, Badge, CompanyBadge, GroupMember
from datetime import datetime

router = APIRouter(prefix="/api/v1", tags=["api"])

# Companies
@router.get("/companies", response_model=List[CompanyResponse])
def list_companies(db: Session = Depends(get_db)):
    return db.query(Company).all()

@router.get("/companies/{company_id}", response_model=CompanyResponse)
def get_company(company_id: str, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

@router.put("/companies/{company_id}", response_model=CompanyResponse)
def update_company(company_id: str, data: CompanyUpdate, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(company, key, value)
    
    db.commit()
    db.refresh(company)
    return company

# Posts
@router.get("/posts", response_model=List[PostResponse])
def get_posts(db: Session = Depends(get_db)):
    return db.query(Post).order_by(Post.created_at.desc()).all()

@router.post("/posts", response_model=PostResponse)
def create_post(company_id: str, data: PostCreate, db: Session = Depends(get_db)):
    post = Post(company_id=company_id, content=data.content, post_type=data.post_type)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

@router.get("/posts/{post_id}", response_model=PostResponse)
def get_post(post_id: str, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.delete("/posts/{post_id}")
def delete_post(post_id: str, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(post)
    db.commit()
    return {"message": "Post deleted"}

# Connections
@router.get("/connections/{company_id}", response_model=List[ConnectionResponse])
def get_connections(company_id: str, db: Session = Depends(get_db)):
    return db.query(Connection).filter(
        (Connection.requester_id == company_id) | (Connection.receiver_id == company_id)
    ).all()

@router.post("/connections/request", response_model=ConnectionResponse)
def send_connection_request(requester_id: str, receiver_id: str, db: Session = Depends(get_db)):
    existing = db.query(Connection).filter(
        Connection.requester_id == requester_id,
        Connection.receiver_id == receiver_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Connection request already exists")
    
    connection = Connection(requester_id=requester_id, receiver_id=receiver_id, status="pending")
    db.add(connection)
    db.commit()
    db.refresh(connection)
    return connection

@router.post("/connections/accept/{connection_id}", response_model=ConnectionResponse)
def accept_connection(connection_id: str, db: Session = Depends(get_db)):
    connection = db.query(Connection).filter(Connection.id == connection_id).first()
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    connection.status = "accepted"
    db.commit()
    db.refresh(connection)
    return connection

@router.post("/connections/reject/{connection_id}", response_model=ConnectionResponse)
def reject_connection(connection_id: str, db: Session = Depends(get_db)):
    connection = db.query(Connection).filter(Connection.id == connection_id).first()
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    connection.status = "rejected"
    db.commit()
    db.refresh(connection)
    return connection

@router.delete("/connections/{connection_id}")
def remove_connection(connection_id: str, db: Session = Depends(get_db)):
    connection = db.query(Connection).filter(Connection.id == connection_id).first()
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    db.delete(connection)
    db.commit()
    return {"message": "Connection removed"}

# Messages
@router.get("/messages/{company_id}", response_model=List[MessageResponse])
def get_messages(company_id: str, other_company_id: str, db: Session = Depends(get_db)):
    return db.query(Message).filter(
        ((Message.sender_id == company_id) & (Message.receiver_id == other_company_id)) |
        ((Message.sender_id == other_company_id) & (Message.receiver_id == company_id))
    ).order_by(Message.created_at.asc()).all()

@router.post("/messages", response_model=MessageResponse)
def send_message(data: MessageCreate, db: Session = Depends(get_db)):
    message = Message(sender_id=data.receiver_id, receiver_id=data.receiver_id, content=data.content)
    db.add(message)
    db.commit()
    db.refresh(message)
    return message

@router.put("/messages/{message_id}/read", response_model=MessageResponse)
def mark_message_read(message_id: str, db: Session = Depends(get_db)):
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    message.is_read = True
    db.commit()
    db.refresh(message)
    return message

# Job Postings
@router.get("/jobs", response_model=List[JobPostingResponse])
def get_jobs(db: Session = Depends(get_db)):
    return db.query(JobPosting).filter(JobPosting.is_active == True).all()

@router.post("/jobs", response_model=JobPostingResponse)
def create_job(company_id: str, data: JobPostingCreate, db: Session = Depends(get_db)):
    job = JobPosting(company_id=company_id, **data.dict())
    db.add(job)
    db.commit()
    db.refresh(job)
    return job

@router.get("/jobs/{job_id}", response_model=JobPostingResponse)
def get_job(job_id: str, db: Session = Depends(get_db)):
    job = db.query(JobPosting).filter(JobPosting.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.put("/jobs/{job_id}", response_model=JobPostingResponse)
def update_job(job_id: str, data: JobPostingUpdate, db: Session = Depends(get_db)):
    job = db.query(JobPosting).filter(JobPosting.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(job, key, value)
    db.commit()
    db.refresh(job)
    return job

@router.delete("/jobs/{job_id}")
def delete_job(job_id: str, db: Session = Depends(get_db)):
    job = db.query(JobPosting).filter(JobPosting.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()
    return {"message": "Job deleted"}

@router.get("/jobs/company/{company_id}", response_model=List[JobPostingResponse])
def get_company_jobs(company_id: str, db: Session = Depends(get_db)):
    return db.query(JobPosting).filter(JobPosting.company_id == company_id).all()

# Notifications
@router.get("/notifications/{company_id}", response_model=List[NotificationResponse])
def get_notifications(company_id: str, db: Session = Depends(get_db)):
    return db.query(Notification).filter(Notification.recipient_id == company_id).order_by(Notification.created_at.desc()).all()

@router.put("/notifications/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_read(notification_id: str, db: Session = Depends(get_db)):
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification

@router.put("/notifications/read-all/{company_id}")
def mark_all_notifications_read(company_id: str, db: Session = Depends(get_db)):
    db.query(Notification).filter(Notification.recipient_id == company_id).update({Notification.is_read: True})
    db.commit()
    return {"message": "All notifications marked as read"}

@router.delete("/notifications/{notification_id}")
def delete_notification(notification_id: str, db: Session = Depends(get_db)):
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    db.delete(notification)
    db.commit()
    return {"message": "Notification deleted"}

# Events
@router.get("/events", response_model=List[EventResponse])
def get_events(db: Session = Depends(get_db)):
    return db.query(Event).order_by(Event.event_date.asc()).all()

@router.post("/events", response_model=EventResponse)
def create_event(data: EventCreate, db: Session = Depends(get_db)):
    event = Event(**data.dict())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

@router.get("/events/{event_id}", response_model=EventResponse)
def get_event(event_id: str, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.put("/events/{event_id}", response_model=EventResponse)
def update_event(event_id: str, data: EventUpdate, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(event, key, value)
    db.commit()
    db.refresh(event)
    return event

@router.delete("/events/{event_id}")
def delete_event(event_id: str, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    db.commit()
    return {"message": "Event deleted"}

# Groups
@router.get("/groups", response_model=List[GroupResponse])
def get_groups(db: Session = Depends(get_db)):
    return db.query(Group).all()

@router.post("/groups", response_model=GroupResponse)
def create_group(data: GroupCreate, db: Session = Depends(get_db)):
    group = Group(**data.dict())
    db.add(group)
    db.commit()
    db.refresh(group)
    return group

@router.get("/groups/{group_id}", response_model=GroupResponse)
def get_group(group_id: str, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    return group

@router.put("/groups/{group_id}", response_model=GroupResponse)
def update_group(group_id: str, data: GroupUpdate, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(group, key, value)
    db.commit()
    db.refresh(group)
    return group

@router.delete("/groups/{group_id}")
def delete_group(group_id: str, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    db.delete(group)
    db.commit()
    return {"message": "Group deleted"}

@router.post("/groups/{group_id}/join")
def join_group(group_id: str, company_id: str, db: Session = Depends(get_db)):
    member = GroupMember(group_id=group_id, company_id=company_id)
    db.add(member)
    db.commit()
    return {"message": "Joined group"}

@router.post("/groups/{group_id}/leave")
def leave_group(group_id: str, company_id: str, db: Session = Depends(get_db)):
    member = db.query(GroupMember).filter(GroupMember.group_id == group_id, GroupMember.company_id == company_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Not a member of this group")
    db.delete(member)
    db.commit()
    return {"message": "Left group"}

# Reviews
@router.get("/reviews/company/{company_id}", response_model=List[ReviewResponse])
def get_company_reviews(company_id: str, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.reviewed_id == company_id).all()

@router.post("/reviews", response_model=ReviewResponse)
def create_review(data: ReviewCreate, db: Session = Depends(get_db)):
    review = Review(**data.dict())
    db.add(review)
    db.commit()
    db.refresh(review)
    return review

@router.put("/reviews/{review_id}", response_model=ReviewResponse)
def update_review(review_id: str, data: ReviewUpdate, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(review, key, value)
    db.commit()
    db.refresh(review)
    return review

@router.delete("/reviews/{review_id}")
def delete_review(review_id: str, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    db.delete(review)
    db.commit()
    return {"message": "Review deleted"}

# Badges
@router.get("/badges", response_model=List[BadgeResponse])
def get_badges(db: Session = Depends(get_db)):
    return db.query(Badge).filter(Badge.is_active == True).all()

@router.post("/badges", response_model=BadgeResponse)
def create_badge(data: BadgeResponse, db: Session = Depends(get_db)):
    badge = Badge(**data.dict())
    db.add(badge)
    db.commit()
    db.refresh(badge)
    return badge

@router.put("/badges/{badge_id}", response_model=BadgeResponse)
def update_badge(badge_id: str, data: BadgeResponse, db: Session = Depends(get_db)):
    badge = db.query(Badge).filter(Badge.id == badge_id).first()
    if not badge:
        raise HTTPException(status_code=404, detail="Badge not found")
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(badge, key, value)
    db.commit()
    db.refresh(badge)
    return badge

@router.delete("/badges/{badge_id}")
def delete_badge(badge_id: str, db: Session = Depends(get_db)):
    badge = db.query(Badge).filter(Badge.id == badge_id).first()
    if not badge:
        raise HTTPException(status_code=404, detail="Badge not found")
    db.delete(badge)
    db.commit()
    return {"message": "Badge deleted"}

@router.post("/companies/{company_id}/badges/{badge_id}", response_model=CompanyBadgeResponse)
def award_badge(company_id: str, badge_id: str, db: Session = Depends(get_db)):
    company_badge = CompanyBadge(company_id=company_id, badge_id=badge_id)
    db.add(company_badge)
    db.commit()
    db.refresh(company_badge)
    return company_badge

@router.delete("/companies/{company_id}/badges/{badge_id}")
def revoke_badge(company_id: str, badge_id: str, db: Session = Depends(get_db)):
    company_badge = db.query(CompanyBadge).filter(CompanyBadge.company_id == company_id, CompanyBadge.badge_id == badge_id).first()
    if not company_badge:
        raise HTTPException(status_code=404, detail="Badge not found")
    db.delete(company_badge)
    db.commit()
    return {"message": "Badge revoked"}

# Search
@router.get("/search")
def search(q: str, type: str = None, limit: int = 20, db: Session = Depends(get_db)):
    results = {}
    
    if type is None or type == "companies":
        results["companies"] = db.query(Company).filter(Company.name.ilike(f"%{q}%")).limit(limit).all()
    
    if type is None or type == "posts":
        results["posts"] = db.query(Post).filter(Post.content.ilike(f"%{q}%")).limit(limit).all()
    
    if type is None or type == "jobs":
        results["jobs"] = db.query(JobPosting).filter(JobPosting.title.ilike(f"%{q}%")).limit(limit).all()
    
    if type is None or type == "events":
        results["events"] = db.query(Event).filter(Event.title.ilike(f"%{q}%")).limit(limit).all()
    
    if type is None or type == "groups":
        results["groups"] = db.query(Group).filter(Group.name.ilike(f"%{q}%")).limit(limit).all()
    
    return results

# Admin
@router.get("/admin/stats", response_model=AdminStats)
def get_admin_stats(db: Session = Depends(get_db)):
    stats = AdminStats(
        total_companies=db.query(Company).count(),
        total_users=db.query(User).count(),
        total_posts=db.query(Post).count(),
        total_connections=db.query(Connection).count(),
        total_jobs=db.query(JobPosting).count(),
        total_events=db.query(Event).count(),
        total_groups=db.query(Group).count()
    )
    return stats

@router.get("/admin/companies", response_model=List[CompanyResponse])
def admin_list_companies(db: Session = Depends(get_db)):
    return db.query(Company).all()

@router.delete("/admin/companies/{company_id}")
def admin_delete_company(company_id: str, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    db.delete(company)
    db.commit()
    return {"message": "Company deleted"}

@router.get("/admin/posts", response_model=List[PostResponse])
def admin_list_posts(db: Session = Depends(get_db)):
    return db.query(Post).all()

@router.delete("/admin/posts/{post_id}")
def admin_delete_post(post_id: str, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(post)
    db.commit()
    return {"message": "Post deleted"}

@router.get("/admin/users", response_model=List[dict])
def admin_list_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [{"id": u.id, "email": u.email, "name": u.name, "role": u.role, "company_id": u.company_id} for u in users]

@router.put("/admin/users/{user_id}/role")
def admin_update_user_role(user_id: str, role: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = role
    db.commit()
    return {"message": "User role updated"}
