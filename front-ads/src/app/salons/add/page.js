'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Building, Phone, Clock, FileText, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createSalon } from '@/services/salonService';
import SearchAddressModal from '@/components/common/SearchAddressModal';

export const RegisterSalonForm = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // 주소 검색 완료 시 폼 데이터 업데이트
  const handleCompletePost = (data) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        address_line1: data.address,
        postal_code: data.zonecode,
      },
    }));
  };
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    business_hours: '',
    business_number: '',
    location: {
      address_line1: '',
      address_line2: '',
      postal_code: '',
      city: '',
      state: ''
    },
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await createSalon(formData);
      toast.success('미용실이 성공적으로 등록되었습니다.');
      router.push('/salons');
    } catch (error) {
      console.error('미용실 등록 실패:', error);
      toast.error('미용실 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/salons');
  };

  return (
    <div className="container mx-auto p-4">

      <div className="w-full px-4 my-3">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold mt-2">새 미용실 등록</h1>
          <Button variant="outline" onClick={handleCancel}>
            취소
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 미용실 정보 카드 */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    <span>미용실 정보</span>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">미용실명 *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">연락처 *</Label>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="000-0000-0000"
                      required
                      />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="business_hours">영업 시간 *</Label>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                    <Input
                      id="business_hours"
                      name="business_hours"
                      value={formData.business_hours}
                      onChange={handleChange}
                      placeholder="10:00 - 20:00"
                      required
                      />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="business_number">사업자 번호 *</Label>
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                    <Input
                      id="business_number"
                      name="business_number"
                      value={formData.business_number}
                      onChange={handleChange}
                      placeholder="000-00-00000"
                      required
                      />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">미용실 소개</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="미용실 소개를 입력하세요"
                    rows={5}
                    className="min-h-[120px]"
                    />
                </div>
              </CardContent>
            </Card>
            
            {/* 위치 정보 카드 */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>위치 정보</span>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location.address_line1">주소 *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="location.address_line1"
                      name="location.address_line1"
                      value={formData.location.address_line1}
                      onChange={handleChange}
                      required
                      />
                    <Button type="button" onClick={() => setIsOpen(true)}>주소 찾기</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location.address_line2">상세 주소</Label>
                  <Input
                    id="location.address_line2"
                    name="location.address_line2"
                    value={formData.location.address_line2}
                    onChange={handleChange}
                    />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location.postal_code">우편번호</Label>
                  <Input
                    id="location.postal_code"
                    name="location.postal_code"
                    value={formData.location.postal_code}
                    onChange={handleChange}
                    readOnly
                    />
                </div>

                {/* 지도 표시 영역 (선택적) */}
                <div className="mt-4 h-[250px] bg-muted rounded-md flex items-center justify-center">
                  <div className="text-muted-foreground text-sm">
                    주소 입력 후 지도가 표시됩니다
                  </div>
                </div>
              </CardContent>

              {/* 주소 검색 모달 - 실제 구현은 별도의 컴포넌트로 필요 */}
              <SearchAddressModal isOpen={isOpen} onClose={() => setIsOpen(false)} onCompletePost={handleCompletePost} />
            </Card>
          </div>
          
          {/* 하단 버튼 섹션 */}
          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={handleCancel}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '처리 중...' : '미용실 등록'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterSalonForm;