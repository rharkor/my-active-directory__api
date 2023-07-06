import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInVzZXJuYW1lIjoiYWRtaW4iLCJmaXJzdE5hbWUiOm51bGwsImxhc3ROYW1lIjpudWxsLCJtZXRhZGF0YSI6bnVsbCwiaWQiOjcsInJvbGVzIjpbeyJpZCI6MiwibmFtZSI6InN1cGVyLWFkbWluIiwiZGlzcGxheU5hbWUiOiJTdXBlciBBZG1pbiIsImRlc2NyaXB0aW9uIjoiU3VwZXIgYWRtaW4gb2YgdGhlIGFwcGxpY2F0aW9uLCBjYW4gZG8gYW55dGhpbmciLCJkZWxldGFibGUiOmZhbHNlfV0sImlhdCI6MTY4ODEyMzQ2MSwiZXhwIjoxNjk4NDkxNDYxfQ.YIbz1hlsMVLQFwIpuBO99RVCjNY8GerOnWsCz9dYpwQ',
  })
  access_token: string;
}
