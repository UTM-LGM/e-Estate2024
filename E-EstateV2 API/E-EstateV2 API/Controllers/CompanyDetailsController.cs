using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CompanyDetailsController : ControllerBase
    {
        private readonly ICompanyDetailRepository _companyDetailRepository;
        public CompanyDetailsController(ICompanyDetailRepository companyDetailRepository)
        {
            _companyDetailRepository = companyDetailRepository;
        }

        [HttpGet]
        [Route("{companyId:int}")]
        public async Task<IActionResult> GetCompanyDetailByCompanyId (int companyId)
        {
            var company = await _companyDetailRepository.GetCompanyDetailByCompanyId(companyId);
            return Ok(company);
        }

        [HttpPost]
        public async Task<IActionResult> AddCompanyDetail([FromBody] CompanyDetail companyDetail)
        {
            var addedCompany = await _companyDetailRepository.AddCompanyDetail(companyDetail);
            return Ok(addedCompany);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateCompanyDetail([FromBody] CompanyDetail companyDetail)
        {
            var updatedTown = await _companyDetailRepository.UpdateCompanyDetail(companyDetail);
            return Ok(updatedTown);
        }
    }
}
