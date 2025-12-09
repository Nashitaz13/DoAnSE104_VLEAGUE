"""
Common response schemas
"""

from typing import Generic, TypeVar, Optional, List

from pydantic import BaseModel

T = TypeVar("T")


class ErrorResponse(BaseModel):
    """Error response"""
    code: str
    message: str


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response"""
    items: List[T]
    total: int
    page: int
    per_page: int
    pages: int

